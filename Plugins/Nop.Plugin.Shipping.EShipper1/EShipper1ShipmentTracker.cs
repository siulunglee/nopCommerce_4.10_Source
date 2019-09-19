//------------------------------------------------------------------------------
// Contributor(s): oskar.kjellin 
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Shipping.Tracking;
using EShipper1Tracking;

namespace Nop.Plugin.Shipping.EShipper1
{
    public class EShipper1ShipmentTracker : IShipmentTracker
    {
        private readonly ILogger _logger;
        private readonly ILocalizationService _localizationService;
        private readonly EShipper1Settings _EShipper1Settings;

        public EShipper1ShipmentTracker(ILogger logger, ILocalizationService localizationService, EShipper1Settings EShipper1Settings)
        {
            this._logger = logger;
            this._localizationService = localizationService;
            this._EShipper1Settings = EShipper1Settings;
        }

        /// <summary>
        /// Gets if the current tracker can track the tracking number.
        /// </summary>
        /// <param name="trackingNumber">The tracking number to track.</param>
        /// <returns>True if the tracker can track, otherwise false.</returns>
        public virtual bool IsMatch(string trackingNumber)
        {
            if (string.IsNullOrWhiteSpace(trackingNumber))
                return false;

            //Not sure if this is true for every shipment, but it is true for all of our shipments
            return trackingNumber.ToUpperInvariant().StartsWith("1Z");
        }

        /// <summary>
        /// Gets an URL for a page to show tracking info (third party tracking page).
        /// </summary>
        /// <param name="trackingNumber">The tracking number to track.</param>
        /// <returns>URL of a tracking page.</returns>
        public virtual string GetUrl(string trackingNumber)
        {
            var url = "http://wwwapps.EShipper1.com/WebTracking/track?trackNums={0}&track.x=Track";
            url = string.Format(url, trackingNumber);
            return url;
        }

        /// <summary>
        /// Gets all events for a tracking number.
        /// </summary>
        /// <param name="trackingNumber">The tracking number to track</param>
        /// <returns>List of Shipment Events.</returns>
        public virtual IList<ShipmentStatusEvent> GetShipmentEvents(string trackingNumber)
        {
            if (string.IsNullOrEmpty(trackingNumber))
                return new List<ShipmentStatusEvent>();

            var result = new List<ShipmentStatusEvent>();
            try
            {
                //use try-catch to ensure exception won't be thrown is web service is not available

                var track = new TrackPortTypeClient();
                var tr = new TrackRequest();
                var EShipper1s = new EShipper1Security();
                var EShipper1sSvcAccessToken = new EShipper1SecurityServiceAccessToken
                {
                    AccessLicenseNumber = _EShipper1Settings.AccessKey
                };
                EShipper1s.ServiceAccessToken = EShipper1sSvcAccessToken;
                var EShipper1sUsrNameToken = new EShipper1SecurityUsernameToken
                {
                    Username = _EShipper1Settings.Username,
                    Password = _EShipper1Settings.Password
                };
                EShipper1s.UsernameToken = EShipper1sUsrNameToken;
                var request = new RequestType();
                string[] requestOption = { "15" };
                request.RequestOption = requestOption;
                tr.Request = request;
                tr.InquiryNumber = trackingNumber;
                System.Net.ServicePointManager.ServerCertificateValidationCallback += delegate { return true; };
                var trackResponse = track.ProcessTrackAsync(EShipper1s, tr).Result.TrackResponse;
                result.AddRange(trackResponse.Shipment.SelectMany(c => c.Package[0].Activity.Select(ToStatusEvent)).ToList());
            }
            catch (Exception exc)
            {
                _logger.Error($"Error while getting EShipper1 shipment tracking info - {trackingNumber}", exc);
            }
            return result;
        }

        private ShipmentStatusEvent ToStatusEvent(ActivityType activity)
        {
            var ev = new ShipmentStatusEvent();
            switch (activity.Status.Type)
            {
                case "I":
                    if (activity.Status.Code == "DP")
                    {
                        ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.Departed");
                    }
                    else if (activity.Status.Code == "EP")
                    {
                        ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.ExportScanned");
                    }
                    else if (activity.Status.Code == "OR")
                    {
                        ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.OriginScanned");
                    }
                    else
                    {
                        ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.Arrived");
                    }
                    break;
                case "X":
                    ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.NotDelivered");
                    break;
                case "M":
                    ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.Booked");
                    break;
                case "D":
                    ev.EventName = _localizationService.GetResource("Plugins.Shipping.EShipper1.Tracker.Delivered");
                    break;
            }
            var dateString = string.Concat(activity.Date, " ", activity.Time);
            ev.Date = DateTime.ParseExact(dateString, "yyyyMMdd HHmmss", CultureInfo.InvariantCulture);
            ev.CountryCode = activity.ActivityLocation.Address.CountryCode;
            ev.Location = activity.ActivityLocation.Address.City;
            return ev;
        }
    }

}