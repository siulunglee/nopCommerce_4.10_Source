using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Nop.Core;
using Nop.Plugin.Shipping.EShipper1.Domain;
using Nop.Plugin.Shipping.EShipper1.Models;
using Nop.Services;
using Nop.Services.Configuration;
using Nop.Services.Localization;
using Nop.Services.Security;
using Nop.Web.Framework;
using Nop.Web.Framework.Controllers;
using Nop.Web.Framework.Mvc.Filters;

namespace Nop.Plugin.Shipping.EShipper1.Controllers
{
    [AuthorizeAdmin]
    [Area(AreaNames.Admin)]
    public class ShippingEShipper1Controller : BasePluginController
    {
        #region Fields

        private readonly ILocalizationService _localizationService;
        private readonly IPermissionService _permissionService;
        private readonly ISettingService _settingService;
        private readonly EShipper1Settings _EShipper1Settings;

        #endregion

        #region Ctor

        public ShippingEShipper1Controller(ILocalizationService localizationService,
            IPermissionService permissionService,
            ISettingService settingService,
            EShipper1Settings EShipper1Settings)
        {
            this._localizationService = localizationService;
            this._permissionService = permissionService;
            this._settingService = settingService;
            this._EShipper1Settings = EShipper1Settings;
        }

        #endregion

        #region Methods

        public IActionResult Configure()
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageShippingSettings))
                return AccessDeniedView();

            var model = new EShipper1ShippingModel
            {
                Url = _EShipper1Settings.Url,
                AccountNumber = _EShipper1Settings.AccountNumber,
                AccessKey = _EShipper1Settings.AccessKey,
                Username = _EShipper1Settings.Username,
                Password = _EShipper1Settings.Password,
                AdditionalHandlingCharge = _EShipper1Settings.AdditionalHandlingCharge,
                InsurePackage = _EShipper1Settings.InsurePackage,
                PackingPackageVolume = _EShipper1Settings.PackingPackageVolume,
                PackingType = (int)_EShipper1Settings.PackingType,
                PackingTypeValues = _EShipper1Settings.PackingType.ToSelectList(),
                PassDimensions = _EShipper1Settings.PassDimensions
            };
            foreach (EShipper1CustomerClassification customerClassification in Enum.GetValues(typeof(EShipper1CustomerClassification)))
            {
                model.AvailableCustomerClassifications.Add(new SelectListItem
                {
                    Text = CommonHelper.ConvertEnum(customerClassification.ToString()),
                    Value = customerClassification.ToString(),
                    Selected = customerClassification == _EShipper1Settings.CustomerClassification
                });
            }
            foreach (EShipper1PickupType pickupType in Enum.GetValues(typeof(EShipper1PickupType)))
            {
                model.AvailablePickupTypes.Add(new SelectListItem
                {
                    Text = CommonHelper.ConvertEnum(pickupType.ToString()),
                    Value = pickupType.ToString(),
                    Selected = pickupType == _EShipper1Settings.PickupType
                });
            }
            foreach (EShipper1PackagingType packagingType in Enum.GetValues(typeof(EShipper1PackagingType)))
            {
                model.AvailablePackagingTypes.Add(new SelectListItem
                {
                    Text = CommonHelper.ConvertEnum(packagingType.ToString()),
                    Value = packagingType.ToString(),
                    Selected = packagingType == _EShipper1Settings.PackagingType
                });
            }

            // Load Domestic service names
            var carrierServicesOfferedDomestic = _EShipper1Settings.CarrierServicesOffered;
            foreach (var service in EShipper1Services.Services)
                model.AvailableCarrierServices.Add(service);

            if (!string.IsNullOrEmpty(carrierServicesOfferedDomestic))
                foreach (var service in EShipper1Services.Services)
                {
                    var serviceId = EShipper1Services.GetServiceId(service);
                    if (!string.IsNullOrEmpty(serviceId))
                    {
                        // Add delimiters [] so that single digit IDs aren't found in multi-digit IDs
                        if (carrierServicesOfferedDomestic.Contains($"[{serviceId}]"))
                            model.CarrierServicesOffered.Add(service);
                    }
                }

            return View("~/Plugins/Shipping.EShipper1/Views/Configure.cshtml", model);
        }

        [HttpPost]
        [AdminAntiForgery]
        public IActionResult Configure(EShipper1ShippingModel model)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageShippingSettings))
                return AccessDeniedView();

            if (!ModelState.IsValid)
                return Configure();

            //save settings
            _EShipper1Settings.Url = model.Url;
            _EShipper1Settings.AccountNumber = model.AccountNumber;
            _EShipper1Settings.AccessKey = model.AccessKey;
            _EShipper1Settings.Username = model.Username;
            _EShipper1Settings.Password = model.Password;
            _EShipper1Settings.AdditionalHandlingCharge = model.AdditionalHandlingCharge;
            _EShipper1Settings.InsurePackage = model.InsurePackage;
            _EShipper1Settings.CustomerClassification = (EShipper1CustomerClassification)Enum.Parse(typeof(EShipper1CustomerClassification), model.CustomerClassification);
            _EShipper1Settings.PickupType = (EShipper1PickupType)Enum.Parse(typeof(EShipper1PickupType), model.PickupType);
            _EShipper1Settings.PackagingType = (EShipper1PackagingType)Enum.Parse(typeof(EShipper1PackagingType), model.PackagingType);
            _EShipper1Settings.PackingPackageVolume = model.PackingPackageVolume;
            _EShipper1Settings.PackingType = (PackingType)model.PackingType;
            _EShipper1Settings.PassDimensions = model.PassDimensions;
            _EShipper1Settings.Tracing = model.Tracing;


            // Save selected services
            var carrierServicesOfferedDomestic = new StringBuilder();
            var carrierServicesDomesticSelectedCount = 0;
            if (model.CheckedCarrierServices != null)
            {
                foreach (var cs in model.CheckedCarrierServices)
                {
                    carrierServicesDomesticSelectedCount++;
                    var serviceId = EShipper1Services.GetServiceId(cs);
                    if (!string.IsNullOrEmpty(serviceId))
                    {
                        // Add delimiters [] so that single digit IDs aren't found in multi-digit IDs
                        carrierServicesOfferedDomestic.AppendFormat("[{0}]:", serviceId);
                    }
                }
            }
            // Add default options if no services were selected
            if (carrierServicesDomesticSelectedCount == 0)
                _EShipper1Settings.CarrierServicesOffered = "[03]:[12]:[11]:[08]:";
            else
                _EShipper1Settings.CarrierServicesOffered = carrierServicesOfferedDomestic.ToString();

            _settingService.SaveSetting(_EShipper1Settings);

            SuccessNotification(_localizationService.GetResource("Admin.Plugins.Saved"));

            return Configure();
        }

        #endregion
    }
}