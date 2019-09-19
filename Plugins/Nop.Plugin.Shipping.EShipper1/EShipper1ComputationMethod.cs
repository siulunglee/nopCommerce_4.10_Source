//------------------------------------------------------------------------------
// Contributor(s): mb 10/20/2010, New York 02/08/2014
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Xml;
using Nop.Core;
using Nop.Core.Domain.Directory;
using Nop.Core.Domain.Shipping;
using Nop.Core.Plugins;
using Nop.Plugin.Shipping.EShipper1.Domain;
using Nop.Services.Configuration;
using Nop.Services.Directory;
using Nop.Services.Discounts;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Orders;
using Nop.Services.Shipping;
using Nop.Services.Shipping.Tracking;

namespace Nop.Plugin.Shipping.EShipper1
{
    /// <summary>
    /// EShipper computation method
    /// </summary>
    public class EShipper1ComputationMethod : BasePlugin, IShippingRateComputationMethod
    {
        #region Constants

        private const int MAXPACKAGEWEIGHT = 150;
        private const string MEASUREWEIGHTSYSTEMKEYWORD = "lb";
        private const string MEASUREDIMENSIONSYSTEMKEYWORD = "inches";

        #endregion

        #region Fields

        private readonly IMeasureService _measureService;
        private readonly IShippingService _shippingService;
        private readonly ISettingService _settingService;
        private readonly EShipper1Settings _EShipper1Settings;
        private readonly ICountryService _countryService;
        private readonly ICurrencyService _currencyService;
        private readonly CurrencySettings _currencySettings;
        private readonly IOrderTotalCalculationService _orderTotalCalculationService;
        private readonly ILogger _logger;
        private readonly ILocalizationService _localizationService;
        private readonly IWebHelper _webHelper;

        private readonly StringBuilder _traceMessages;

        #endregion

        #region Ctor

        public EShipper1ComputationMethod(IMeasureService measureService,
            IShippingService shippingService,
            ISettingService settingService,
            EShipper1Settings EShipper1Settings,
            ICountryService countryService,
            ICurrencyService currencyService,
            CurrencySettings currencySettings,
            IOrderTotalCalculationService orderTotalCalculationService,
            ILogger logger,
            ILocalizationService localizationService,
            IWebHelper webHelper)
        {
            this._measureService = measureService;
            this._shippingService = shippingService;
            this._settingService = settingService;
            this._EShipper1Settings = EShipper1Settings;
            this._countryService = countryService;
            this._currencyService = currencyService;
            this._currencySettings = currencySettings;
            this._orderTotalCalculationService = orderTotalCalculationService;
            this._logger = logger;
            this._localizationService = localizationService;
            this._webHelper = webHelper;

            this._traceMessages = new StringBuilder();
        }

        #endregion

        #region Utilities

        private string CreateRequest(string accessKey, string username, string password,
            GetShippingOptionRequest getShippingOptionRequest, EShipper1CustomerClassification customerClassification,
            EShipper1PickupType pickupType, EShipper1PackagingType packagingType, bool saturdayDelivery)
        {
            var addressZipPostalCodeFrom = getShippingOptionRequest.ZipPostalCodeFrom;
            var addressFrom = getShippingOptionRequest.AddressFrom;
            var addressCityFrom = getShippingOptionRequest.CityFrom;
            //var addressStateProvFrom = getShippingOptionRequest.StateProvinceFrom;
            var addressStateProvFrom = getShippingOptionRequest.StateProvinceFrom?.Abbreviation;
            var addressCountryCodeFrom = getShippingOptionRequest.CountryFrom.TwoLetterIsoCode;
            var addressCompanyName = getShippingOptionRequest.CountryFrom.Name;

            var shippingZipPostalCodeTo = getShippingOptionRequest.ShippingAddress.ZipPostalCode;
            var shippingAddressTo = getShippingOptionRequest.ShippingAddress.Address1;
            var shippingCityTo = getShippingOptionRequest.ShippingAddress.City;
            //var shippingStateProvTo = getShippingOptionRequest.ShippingAddress.StateProvince;
            var shippingStateProvTo = getShippingOptionRequest.ShippingAddress.StateProvince?.Abbreviation;
            var shippingCountryCodeTo = getShippingOptionRequest.ShippingAddress.Country.TwoLetterIsoCode;

            var shippingCompanyNameTo = getShippingOptionRequest.ShippingAddress.Company;

            var sb = new StringBuilder();
            sb.Append("<?xml version='1.0' encoding='UTF-8'?>");
            sb.Append("");

            sb.AppendFormat ("<EShipper xmlns='http://www.eshipper.net/XMLSchema' username='{0}' password='{1}' version='3.2.0'>", username, password);

            sb.Append("<QuoteRequest serviceId='0' stackable='true'>");
            sb.AppendFormat("<From id='123' company='Boom Imaging' address1='{0}' city='{1}' state='{2}' country='{3}' zip='{4}' />", addressFrom, addressCityFrom, addressStateProvFrom, addressCountryCodeFrom, addressZipPostalCodeFrom);
            sb.AppendFormat("<To company='{5}' address1='{0}' city='{1}' state='{2}' country='{3}' zip='{4}' />", shippingAddressTo, shippingCityTo, shippingStateProvTo, shippingCountryCodeTo, shippingZipPostalCodeTo, shippingCompanyNameTo);

            var currencyCode = _currencyService.GetCurrencyById(_currencySettings.PrimaryStoreCurrencyId).CurrencyCode;

            //get subTotalWithoutDiscountBase, for use as insured value (when Settings.InsurePackage)
            //(note: prior versions used "with discount", but "without discount" better reflects true value to insure.)
            //TODO we should use getShippingOptionRequest.Items.GetQuantity() method to get subtotal
            _orderTotalCalculationService.GetShoppingCartSubTotal(getShippingOptionRequest.Items.Select(x => x.ShoppingCartItem).ToList(),
                false, out decimal _, out List<DiscountForCaching> _, out decimal subTotalWithoutDiscountBase, out decimal _);

            if (_EShipper1Settings.Tracing)
                _traceMessages.AppendLine(" Packing Type: " + _EShipper1Settings.PackingType.ToString());


            // Eshipper XML Individual Package Code Start here.
            sb.AppendFormat("<Packages type='Package'>");


            // Change the packing method specificied for Boom Imaging.  It can only use SetBoomMethodOfPackageItems function to put the packup.
            switch (_EShipper1Settings.PackingType)
            {
                case PackingType.PackByOneItemPerPackage:
                    // temp comment off
                    //SetIndividualPackageLineItemsOneItemPerPackage(sb, getShippingOptionRequest, packagingType, currencyCode);
                    SetBoomMethodOfPackageItems(sb, getShippingOptionRequest, packagingType, subTotalWithoutDiscountBase, currencyCode);
                    break;
                case PackingType.PackByVolume:
                    SetIndividualPackageLineItemsCubicRootDimensions(sb, getShippingOptionRequest, packagingType, subTotalWithoutDiscountBase, currencyCode);
                    break;
                case PackingType.PackByDimensions:
                default:

                    // Sample Code Generated by SetIndividualPackageLineItems function method
                    //sb.AppendFormat("<Package length='35' width='4.5' height='4.5' weight='11' type='Pallet' freightClass='70' nmfcCode='123457'  insuranceAmount='0.0' codAmount='0.0' description='desc.' />");

                    // packagingType and currencyCode is not implemented yet and only set to "package" type and currency Code is CAD only
                    SetIndividualPackageLineItems(sb, getShippingOptionRequest, packagingType, subTotalWithoutDiscountBase, currencyCode);
                    //SetBoomMethodOfPackageItems(sb, getShippingOptionRequest, packagingType, subTotalWithoutDiscountBase, currencyCode);
                    break;
            }

            // Eshipper Xml package Quote Ending
            sb.Append("</Packages>");
            sb.Append("</QuoteRequest></EShipper>");

            //sb.Append("</Shipment>");
            //sb.Append("</RatingServiceSelectionRequest>");

            // Return the whole Quote request XML to the doRequest function and pass to Eshipper.
            return sb.ToString();
        }

        private void AppendPackageRequest(StringBuilder sb, EShipper1PackagingType packagingType, decimal length, decimal height, decimal width, decimal weight, decimal insuranceAmount, string currencyCode)
        {
            if (_EShipper1Settings.Tracing)
                _traceMessages.AppendFormat(" Package: LxHxW={0}x{1}x{2}; Weight={3}; Insured={4} {5}.", length, height, width, weight, insuranceAmount, currencyCode).AppendLine();

    
            // Eshipper Shipping Quote Request XML format
            //sb.AppendFormat("<Packages type='Package'>");

            decimal insuranceAmountActual = 0;
            if (insuranceAmount > Decimal.Zero)
            {
                insuranceAmountActual = insuranceAmount;
            }

            string pakType = "Pallet", description = "Package", freightClass = "70", nmfcCode = "Boom";
            double codAmount = 0.0;

            sb.AppendFormat("<Package length='{0}' width='{1}' height='{2}' weight='{3}' type='{4}' freightClass='{5}' nmfcCode='{6}'  insuranceAmount='{7}' codAmount='{8}' description='{9}' />", 
                            length, width, height, weight, pakType, freightClass, nmfcCode, insuranceAmount, codAmount, description);
        }

        private void SetBoomMethodOfPackageItems(StringBuilder sb, GetShippingOptionRequest getShippingOptionRequest, EShipper1PackagingType packagingType, decimal orderSubTotal, string currencyCode)
        {
            // Rate request setup - We don't use Total Dimensions of Shopping Cart Items determines number of packages
            // we will use 4D Smart service from EShipper to determine the box.

            var usedMeasureWeight = GetUsedMeasureWeight();
            var usedMeasureDimension = GetUsedMeasureDimension();




            foreach (var packageItem in getShippingOptionRequest.Items)
            {
                var sci = packageItem.ShoppingCartItem;
                var qty = packageItem.GetQuantity();

                //get dimensions for qty 1
                _shippingService.GetDimensions(new List<GetShippingOptionRequest.PackageItem>
                                               {
                                                   new GetShippingOptionRequest.PackageItem(sci, 1)
                                               }, out decimal widthTmp, out decimal lengthTmp, out decimal heightTmp, true);

                //var length = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
                //var height = ConvertFromPrimaryMeasureDimension(heightTmp, usedMeasureDimension);
                //var width = ConvertFromPrimaryMeasureDimension(widthTmp, usedMeasureDimension);
                //var weight = ConvertFromPrimaryMeasureWeight(sci.Product.Weight, usedMeasureWeight);

                var length = getShippingOptionRequest.Items.FirstOrDefault().ShoppingCartItem.Product.Length;
                var height = getShippingOptionRequest.Items.FirstOrDefault().ShoppingCartItem.Product.Height;
                var width = getShippingOptionRequest.Items.FirstOrDefault().ShoppingCartItem.Product.Width;
                var weight = getShippingOptionRequest.Items.FirstOrDefault().ShoppingCartItem.Product.Weight;


                if (length < 1)
                    length = 1;
                if (height < 1)
                    height = 1;
                if (width < 1)
                    width = 1;
                if (weight < 1)
                    weight = 1;

                var insuranceAmountPerPackage = _EShipper1Settings.InsurePackage ? Convert.ToInt32(sci.Product.Price) : 0;

                for (var j = 0; j < qty; j++)
                {
                    AppendPackageRequest(sb, packagingType, length, height, width, weight, insuranceAmountPerPackage, currencyCode);
                }
            }
        }


        private void SetIndividualPackageLineItems(StringBuilder sb, GetShippingOptionRequest getShippingOptionRequest, EShipper1PackagingType packagingType, decimal orderSubTotal, string currencyCode)
        {
            // Rate request setup - Total Dimensions of Shopping Cart Items determines number of packages

            var usedMeasureWeight = GetUsedMeasureWeight();
            var usedMeasureDimension = GetUsedMeasureDimension();

            _shippingService.GetDimensions(getShippingOptionRequest.Items, out decimal widthTmp, out decimal lengthTmp, out decimal heightTmp, true);

            var length = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
            var height = ConvertFromPrimaryMeasureDimension(heightTmp, usedMeasureDimension);
            var width = ConvertFromPrimaryMeasureDimension(widthTmp, usedMeasureDimension);
            var weight = ConvertFromPrimaryMeasureWeight(_shippingService.GetTotalWeight(getShippingOptionRequest, ignoreFreeShippedItems: true), usedMeasureWeight);
            if (length < 1)
                length = 1;
            if (height < 1)
                height = 1;
            if (width < 1)
                width = 1;
            if (weight < 1)
                weight = 1;

            if ((!IsPackageTooHeavy(weight)) && (!IsPackageTooLarge(length, height, width)))
            {
                if (!_EShipper1Settings.PassDimensions)
                    length = width = height = 0;

                var insuranceAmount = _EShipper1Settings.InsurePackage ? Convert.ToInt32(orderSubTotal) : 0;
                AppendPackageRequest(sb, packagingType, length, height, width, weight, insuranceAmount, currencyCode);
                System.Diagnostics.Trace.WriteLine("Package XML overweight");
            }
            else
            {
                var totalPackagesDims = 1;
                var totalPackagesWeights = 1;
                if (IsPackageTooHeavy(weight))
                {
                    totalPackagesWeights = Convert.ToInt32(Math.Ceiling((decimal)weight / (decimal)MAXPACKAGEWEIGHT));
                }
                if (IsPackageTooLarge(length, height, width))
                {
                    totalPackagesDims = Convert.ToInt32(Math.Ceiling((decimal)TotalPackageSize(length, height, width) / (decimal)108));
                }
                var totalPackages = totalPackagesDims > totalPackagesWeights ? totalPackagesDims : totalPackagesWeights;
                if (totalPackages == 0)
                    totalPackages = 1;

                var weight2 = weight / totalPackages;
                var height2 = height / totalPackages;
                var width2 = width / totalPackages;
                var length2 = length / totalPackages;
                if (weight2 < 1)
                    weight2 = 1;
                if (height2 < 1)
                    height2 = 1;
                if (width2 < 1)
                    width2 = 1;
                if (length2 < 1)
                    length2 = 1;

                if (!_EShipper1Settings.PassDimensions)
                    length2 = width2 = height2 = 0;

                //The maximum declared amount per package: 50000 USD.
                var insuranceAmountPerPackage = _EShipper1Settings.InsurePackage ? Convert.ToInt32(orderSubTotal / totalPackages) : 0;

                for (var i = 0; i < totalPackages; i++)
                {
                    AppendPackageRequest(sb, packagingType, length2, height2, width2, weight2, insuranceAmountPerPackage, currencyCode);
                    System.Diagnostics.Trace.WriteLine("======== eshipper ========");
                    System.Diagnostics.Trace.WriteLine("Package XML Line: " + (i+1));
                }
            }
        }

        private void SetIndividualPackageLineItemsOneItemPerPackage(StringBuilder sb, GetShippingOptionRequest getShippingOptionRequest, EShipper1PackagingType packagingType, string currencyCode)
        {
            // Rate request setup - each Shopping Cart Item is a separate package

            var usedMeasureWeight = GetUsedMeasureWeight();
            var usedMeasureDimension = GetUsedMeasureDimension();

            foreach (var packageItem in getShippingOptionRequest.Items)
            {
                var sci = packageItem.ShoppingCartItem;
                var qty = packageItem.GetQuantity();

                //get dimensions for qty 1
                _shippingService.GetDimensions(new List<GetShippingOptionRequest.PackageItem>
                                               {
                                                   new GetShippingOptionRequest.PackageItem(sci, 1)
                                               }, out decimal widthTmp, out decimal lengthTmp, out decimal heightTmp, true);

                var length = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
                var height = ConvertFromPrimaryMeasureDimension(heightTmp, usedMeasureDimension);
                var width = ConvertFromPrimaryMeasureDimension(widthTmp, usedMeasureDimension);
                var weight = ConvertFromPrimaryMeasureWeight(sci.Product.Weight, usedMeasureWeight);
                if (length < 1)
                    length = 1;
                if (height < 1)
                    height = 1;
                if (width < 1)
                    width = 1;
                if (weight < 1)
                    weight = 1;

                //The maximum declared amount per package: 50000 USD.
                //TODO: Currently using Product.Price - should we use GetUnitPrice() instead?
                // Convert.ToInt32(_priceCalculationService.GetUnitPrice(sci, includeDiscounts:false))
                //One could argue that the insured value should be based on Cost rather than Price.
                //GetUnitPrice handles Attribute Adjustments and also Customer Entered Price.
                //But, even with includeDiscounts:false, it could apply a "discount" from Tier pricing.
                var insuranceAmountPerPackage = _EShipper1Settings.InsurePackage ? Convert.ToInt32(sci.Product.Price) : 0;

                for (var j = 0; j < qty; j++)
                {
                    AppendPackageRequest(sb, packagingType, length, height, width, weight, insuranceAmountPerPackage, currencyCode);
                }
            }
        }

        private void SetIndividualPackageLineItemsCubicRootDimensions(StringBuilder sb, GetShippingOptionRequest getShippingOptionRequest, EShipper1PackagingType packagingType, decimal orderSubTotal, string currencyCode)
        {
            // Rate request setup - Total Volume of Shopping Cart Items determines number of packages

            //Dimensional weight is based on volume (the amount of space a package
            //occupies in relation to its actual weight). If the cubic size of your
            //package measures three cubic feet (5,184 cubic inches or 84,951
            //cubic centimetres) or greater, you will be charged the greater of the
            //dimensional weight or the actual weight.
            //This algorithm devides total package volume by the EShipper settings PackingPackageVolume
            //so that no package requires dimensional weight; this could result in an under-charge.

            var usedMeasureWeight = GetUsedMeasureWeight();
            var usedMeasureDimension = GetUsedMeasureDimension();

            int totalPackagesDims;
            int length;
            int height;
            int width;

            if (getShippingOptionRequest.Items.Count == 1 && getShippingOptionRequest.Items[0].GetQuantity() == 1)
            {
                var sci = getShippingOptionRequest.Items[0].ShoppingCartItem;

                //get dimensions for qty 1
                _shippingService.GetDimensions(new List<GetShippingOptionRequest.PackageItem>
                                               {
                                                   new GetShippingOptionRequest.PackageItem(sci, 1)
                                               }, out decimal widthTmp, out decimal lengthTmp, out decimal heightTmp, true);

                totalPackagesDims = 1;
                length = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
                height = ConvertFromPrimaryMeasureDimension(heightTmp, usedMeasureDimension);
                width = ConvertFromPrimaryMeasureDimension(widthTmp, usedMeasureDimension);
            }
            else
            {
                decimal totalVolume = 0;
                foreach (var item in getShippingOptionRequest.Items)
                {
                    var sci = item.ShoppingCartItem;

                    //get dimensions for qty 1
                    _shippingService.GetDimensions(new List<GetShippingOptionRequest.PackageItem>
                                               {
                                                   new GetShippingOptionRequest.PackageItem(sci, 1)
                                               }, out decimal widthTmp, out decimal lengthTmp, out decimal _, true);

                    var productLength = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
                    var productHeight = ConvertFromPrimaryMeasureDimension(lengthTmp, usedMeasureDimension);
                    var productWidth = ConvertFromPrimaryMeasureDimension(widthTmp, usedMeasureDimension);
                    totalVolume += item.GetQuantity() * (productHeight * productWidth * productLength);
                }

                int dimension;
                if (totalVolume == 0)
                {
                    dimension = 0;
                    totalPackagesDims = 1;
                }
                else
                {
                    // cubic inches
                    var packageVolume = _EShipper1Settings.PackingPackageVolume;
                    if (packageVolume <= 0)
                        packageVolume = 5184;

                    // cube root (floor)
                    dimension = Convert.ToInt32(Math.Floor(Math.Pow(Convert.ToDouble(packageVolume), (double)(1.0 / 3.0))));
                    if (IsPackageTooLarge(dimension, dimension, dimension))
                        throw new NopException("EShipper1Settings.PackingPackageVolume exceeds max package size");

                    // adjust packageVolume for dimensions calculated
                    packageVolume = dimension * dimension * dimension;

                    totalPackagesDims = Convert.ToInt32(Math.Ceiling(totalVolume / packageVolume));
                }

                length = width = height = dimension;
            }
            if (length < 1)
                length = 1;
            if (height < 1)
                height = 1;
            if (width < 1)
                width = 1;

            var weight = ConvertFromPrimaryMeasureWeight(_shippingService.GetTotalWeight(getShippingOptionRequest, ignoreFreeShippedItems: true), usedMeasureWeight);
            if (weight < 1)
                weight = 1;

            var totalPackagesWeights = 1;
            if (IsPackageTooHeavy(weight))
            {
                totalPackagesWeights = Convert.ToInt32(Math.Ceiling((decimal)weight / (decimal)MAXPACKAGEWEIGHT));
            }

            var totalPackages = totalPackagesDims > totalPackagesWeights ? totalPackagesDims : totalPackagesWeights;

            var weightPerPackage = weight / totalPackages;

            //The maximum declared amount per package: 50000 USD.
            var insuranceAmountPerPackage = _EShipper1Settings.InsurePackage ? Convert.ToInt32(orderSubTotal / totalPackages) : 0;

            for (var i = 0; i < totalPackages; i++)
            {
                AppendPackageRequest(sb, packagingType, length, height, width, weightPerPackage, insuranceAmountPerPackage, currencyCode);
            }

        }

        private string DoRequest(string url, string requestString)
        {
            var bytes = Encoding.ASCII.GetBytes(requestString);
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = WebRequestMethods.Http.Post;
            request.ContentType = MimeTypes.ApplicationXWwwFormUrlencoded;
            request.ContentLength = bytes.Length;
            using (var requestStream = request.GetRequestStream())
                requestStream.Write(bytes, 0, bytes.Length);
            using (var response = request.GetResponse())
            {
                string responseXml;
                using (var reader = new StreamReader(response.GetResponseStream()))
                    responseXml = reader.ReadToEnd();

                return responseXml;
            }
        }

        private string GetCustomerClassificationCode(EShipper1CustomerClassification customerClassification)
        {
            switch (customerClassification)
            {
                case EShipper1CustomerClassification.Wholesale:
                    return "01";
                case EShipper1CustomerClassification.Occasional:
                    return "03";
                case EShipper1CustomerClassification.Retail:
                    return "04";
                default:
                    throw new NopException("Unknown EShipper customer classification code");
            }
        }

        private string GetPackagingTypeCode(EShipper1PackagingType packagingType)
        {
            switch (packagingType)
            {
                case EShipper1PackagingType.Letter:
                    return "01";
                case EShipper1PackagingType.CustomerSuppliedPackage:
                    return "02";
                case EShipper1PackagingType.Tube:
                    return "03";
                case EShipper1PackagingType.PAK:
                    return "04";
                case EShipper1PackagingType.ExpressBox:
                    return "21";
                case EShipper1PackagingType._10KgBox:
                    return "25";
                case EShipper1PackagingType._25KgBox:
                    return "24";
                default:
                    throw new NopException("Unknown EShipper packaging type code");
            }
        }

        private string GetPickupTypeCode(EShipper1PickupType pickupType)
        {
            switch (pickupType)
            {
                case EShipper1PickupType.DailyPickup:
                    return "01";
                case EShipper1PickupType.CustomerCounter:
                    return "03";
                case EShipper1PickupType.OneTimePickup:
                    return "06";
                case EShipper1PickupType.OnCallAir:
                    return "07";
                case EShipper1PickupType.SuggestedRetailRates:
                    return "11";
                case EShipper1PickupType.LetterCenter:
                    return "19";
                case EShipper1PickupType.AirServiceCenter:
                    return "20";
                default:
                    throw new NopException("Unknown EShipper pickup type code");
            }
        }

        private string GetServiceName(string serviceId)
        {
            switch (serviceId)
            {
                //case "01":
                //    return "EShipper Next Day Air";
                //case "02":
                //    return "EShipper 2nd Day Air";
                //case "03":
                //    return "EShipper Ground";
                //case "07":
                //    return "EShipper Worldwide Express";
                //case "08":
                //    return "EShipper Worldwide Expedited";
                //case "11":
                //    return "EShipper Standard";
                //case "12":
                //    return "EShipper 3 Day Select";
                //case "13":
                //    return "EShipper Next Day Air Saver";
                //case "14":
                //    return "EShipper Next Day Air Early A.M.";
                //case "54":
                //    return "EShipper Worldwide Express Plus";
                //case "59":
                //    return "EShipper 2nd Day Air A.M.";
                //case "65":
                //    return "EShipper Saver";
                //case "82": //82-86, for Polish Domestic Shipments
                //    return "EShipper Today Standard";
                //case "83":
                //    return "EShipper Today Dedicated Courier";
                //case "85":
                //    return "EShipper Today Express";
                case "86":
                    return "EShipper Today Express Saver";
                default:
                    return "Unknown";
            }
        }

        private bool IsPackageTooLarge(int length, int height, int width)
        {
            var total = TotalPackageSize(length, height, width);
            return total > 165;
        }

        private int TotalPackageSize(int length, int height, int width)
        {
            var girth = height + height + width + width;
            var total = girth + length;
            return total;
        }

        private bool IsPackageTooHeavy(int weight)
        {
            return weight > MAXPACKAGEWEIGHT;
        }

        private MeasureWeight GetUsedMeasureWeight()
        {
            var usedMeasureWeight = _measureService.GetMeasureWeightBySystemKeyword(MEASUREWEIGHTSYSTEMKEYWORD);
            if (usedMeasureWeight == null)
                throw new NopException("EShipper shipping service. Could not load \"{0}\" measure weight", MEASUREWEIGHTSYSTEMKEYWORD);
            return usedMeasureWeight;
        }

        private MeasureDimension GetUsedMeasureDimension()
        {
            var usedMeasureDimension = _measureService.GetMeasureDimensionBySystemKeyword(MEASUREDIMENSIONSYSTEMKEYWORD);
            if (usedMeasureDimension == null)
                throw new NopException("EShipper shipping service. Could not load \"{0}\" measure dimension", MEASUREDIMENSIONSYSTEMKEYWORD);

            return usedMeasureDimension;
        }

        private int ConvertFromPrimaryMeasureDimension(decimal quantity, MeasureDimension usedMeasureDimension)
        {
            return Convert.ToInt32(Math.Ceiling(_measureService.ConvertFromPrimaryMeasureDimension(quantity, usedMeasureDimension)));
        }

        private int ConvertFromPrimaryMeasureWeight(decimal quantity, MeasureWeight usedMeasureWeighht)
        {
            return Convert.ToInt32(Math.Ceiling(_measureService.ConvertFromPrimaryMeasureWeight(quantity, usedMeasureWeighht)));
        }

        public class ShippingOptionWithTransitDay
        {
            public string days { get; set; }

            public ShippingOption shippingOption { get; set; }
        }

        private IEnumerable<ShippingOption> ParseResponse(string response, ref string error)
        {
            var shippingOptions = new List<ShippingOption>();

            var shippingOptionsWithTransitDay = new List<ShippingOptionWithTransitDay>();

            var carrierServicesOffered = _EShipper1Settings.CarrierServicesOffered;
            int quoteCount = 0;

            using (var sr = new StringReader(response))
            using (var tr = new XmlTextReader(sr))

                // ===========================================================================================================================
                // The following code is changed by Henry Lee (siulunglee@yahoo.com) using nopcommerce UPS computation plugin as an example.
                while (tr.Read())
                {
                    if ((tr.Name == "Error") && (tr.NodeType == XmlNodeType.Element))
                    {
                        var errorText = "";
                        error = "EShipper1 Error returned: " + errorText;
                        continue;
                    }
                    if ((tr.Name == "Quote") && (tr.NodeType == XmlNodeType.Element))
                    {
                        string serviceCode = "", monetaryValue = "", carrierName = "", serviceName = "",
                            surChargeId = "", surChargeName = "", amount = "", transitDays = "1", deliveryDate = "";


                        //parse negotiated rates                   
                        int attrCount = tr.AttributeCount;
                        if (tr.HasAttributes)
                        {
                            while (tr.MoveToNextAttribute())
                            {
                                //Console.WriteLine("{0}:{1}", tr.Name, tr.Value);

                                if (tr.Name == "serviceId")
                                {
                                    serviceCode = tr.Value;
                                }

                                if (tr.Name == "carrierName" && tr.Value != null)
                                {
                                    carrierName = tr.Value;
                                }

                                if (tr.Name == "serviceName" && tr.Value != null)
                                {
                                    serviceName = tr.Value;
                                }

                                if (tr.Name == "transitDays" && tr.Value != null)
                                {
                                    transitDays = tr.Value;
                                }

                                if (tr.Name == "deliveryDate" && tr.Value != null)
                                {
                                    deliveryDate = tr.Value;
                                }

                                if (tr.Name == "totalCharge" && tr.Value != null)
                                {
                                    monetaryValue = tr.Value;
                                }

                                System.Diagnostics.Trace.WriteLine(tr.Name + ":" + (tr.Value != null ? tr.Value : ""));
                            }
                            tr.MoveToElement();
                        }

                        var service = GetServiceName(serviceCode);
                        var serviceId = $"[{serviceCode}]";

                        // Go to the next rate if the service ID is not in the list of services to offer
                        // Then put them into shippigOptions arrays
                        // if (!string.IsNullOrEmpty(carrierServicesOffered) && !carrierServicesOffered.Contains(serviceId))
                        //{
                        //    //continue;
                        //}

                        // Weed out unwanted or unknown service rates
                        if (service.ToUpper() != "UNKNOWN")
                        {
                            var shippingOption = new ShippingOption
                            {
                                Rate = Convert.ToDecimal(monetaryValue, new CultureInfo("en-US")),
                                Name = service
                            };

                            shippingOptions.Add(shippingOption);
                        }
                        else
                        {
                            if (carrierName != "" && serviceName != "" && monetaryValue != "")
                            {
                                //int tDays = 0;
                                //int.TryParse(transitDays, out tDays);
                                //if (tDays <= 1)
                                //{
                                //    transitDays = "1-2";
                                //}
                                //else if (tDays == 2)
                                //{
                                //    transitDays = "2-4";
                                //}
                                //else if (tDays == 3)
                                //{
                                //    transitDays = "2-4";
                                //}
                                //else if(tDays >= 4)
                                //{
                                //    transitDays = "3-5";
                                //}
                                //else
                                //    transitDays = "7 days or up";

                                var shippingOption = new ShippingOption
                                {
                                    Rate = Convert.ToDecimal(monetaryValue, new CultureInfo("en-US")),
                                    Name = carrierName + " - " + serviceName
                                    //Name = "" + transitDays + " day(s): " + carrierName + " / " + serviceName
                                };
                                

                                var shippingOptionWithTransitDay = new ShippingOptionWithTransitDay { days = transitDays, shippingOption = shippingOption  };
                                shippingOptionsWithTransitDay.Add(shippingOptionWithTransitDay);
                                quoteCount++;
                            }
                        }
                    }
                }
            System.Diagnostics.Trace.WriteLine("Quote Counts:" + quoteCount);

            // sort the shippingOptions list by transit days and then shipping rate

            var shippingOptionsResult = from so in shippingOptionsWithTransitDay
                         orderby so.days, so.shippingOption.Rate
                         select so;

            int i = 0;
            string days = "0";
            int curDays = 0;
            int MaxListingNumber = 4;
            int numberOfListedCarrier = 1;  // options to list how many carrier options you want list by transit days from cheapest to most expensive.
                                            // ie. numberOfListedCarrier = 1 will list only the first cheapest options by transit days.

            decimal extraFeeMultiplierOfShipping = 1.25m; // extra packing fee charges

            // loop the shippingOptions list to select the rate

            foreach (ShippingOptionWithTransitDay so in shippingOptionsResult) {
                switch (days)
                {
                    case "0":
                        so.shippingOption.Name = "Express 1-2 days: " + so.shippingOption.Name;
                        break;
                    case "1":
                        so.shippingOption.Name = "2-3 days: " + so.shippingOption.Name;
                        break;
                    case "2":
                        // comment out to disable the choices
                        so.shippingOption.Name = "3-4 days: " + so.shippingOption.Name;
                        //so.shippingOption.Name = "";
                        break;
                    case "3":
                        so.shippingOption.Name = "3-5 days: " + so.shippingOption.Name;
                        break;
                    case "4":
                        // comment out to disable the choices
                        // so.shippingOption.Name = "4-6 days: " + so.shippingOption.Name;
                        so.shippingOption.Name = "";
                        break;
                    case "5":
                        // comment out to disable the choices
                        //so.shippingOption.Name = "5-7 days: " + so.shippingOption.Name;
                        so.shippingOption.Name = "";
                        break;
                    default:
                        break;
                }


                if ((so.days != days && i < numberOfListedCarrier) || (so.days == days && i < numberOfListedCarrier))
                {
                    System.Diagnostics.Trace.WriteLine("** " + so.shippingOption.Name + " (" + so.shippingOption.Rate + ")");

                    //so.shippingOption.Name = days +  ": " + so.shippingOption.Name;
                    // so.shippingOption.Name += " (" + days + ")";
                    if (so.shippingOption.Name != "")
                    {
                        so.shippingOption.Rate = so.shippingOption.Rate * extraFeeMultiplierOfShipping;
                        shippingOptions.Add(so.shippingOption);
                    }
                    days = so.days;
                    i++;
                    continue;
                }
                else if (i >= numberOfListedCarrier && so.days == days)
                {
                    System.Diagnostics.Trace.WriteLine(so.shippingOption.Name + " (" + so.shippingOption.Rate + ")");
                    //shippingOptions.Add(so.shippingOption);
                    i++;
                }
                else if(so.days != days)
                {
                    System.Diagnostics.Trace.WriteLine("** " + so.shippingOption.Name + " (" + so.shippingOption.Rate + ")");
                    // so.shippingOption.Name += " (" + days + ")";
                    if (so.shippingOption.Name != "")
                    {
                        so.shippingOption.Rate = so.shippingOption.Rate * extraFeeMultiplierOfShipping;
                        shippingOptions.Add(so.shippingOption);
                    }
                    days = so.days;
                    i = 1;
                }
            }
            // ===========================================================================================================================

            return shippingOptions;
        }

        #endregion

        #region Methods

        /// <summary>
        ///  Gets available shipping options
        /// </summary>
        /// <param name="getShippingOptionRequest">A request for getting shipping options</param>
        /// <returns>Represents a response of getting shipping rate options</returns>
        public GetShippingOptionResponse GetShippingOptions(GetShippingOptionRequest getShippingOptionRequest)
        {
            if (getShippingOptionRequest == null)
                throw new ArgumentNullException(nameof(getShippingOptionRequest));

            var response = new GetShippingOptionResponse();

            if (getShippingOptionRequest.Items == null)
            {
                response.AddError("No shipment items");
                return response;
            }

            if (getShippingOptionRequest.ShippingAddress == null)
            {
                response.AddError("Shipping address is not set");
                return response;
            }

            if (getShippingOptionRequest.ShippingAddress.Country == null)
            {
                response.AddError("Shipping country is not set");
                return response;
            }

            if (getShippingOptionRequest.CountryFrom == null)
            {
                getShippingOptionRequest.CountryFrom = _countryService.GetAllCountries().FirstOrDefault();
            }

            try
            {
                var requestString = CreateRequest(_EShipper1Settings.AccessKey, _EShipper1Settings.Username, _EShipper1Settings.Password, getShippingOptionRequest,
                    _EShipper1Settings.CustomerClassification, _EShipper1Settings.PickupType, _EShipper1Settings.PackagingType, false);
                if (_EShipper1Settings.Tracing)
                    _traceMessages.AppendLine("Request:").AppendLine(requestString);

                var responseXml = DoRequest(_EShipper1Settings.Url, requestString);
                if (_EShipper1Settings.Tracing)
                    _traceMessages.AppendLine("Response:").AppendLine(responseXml);

                var error = "";
                var shippingOptions = ParseResponse(responseXml, ref error);
                if (string.IsNullOrEmpty(error))
                {

                    var i = 0;
                    foreach (var shippingOption in shippingOptions)
                    {
                        //if (!shippingOption.Name.ToLower().StartsWith("EShipper1"))
                        if (!shippingOption.Name.ToLower().StartsWith("EShipper1"))
                            shippingOption.Name = $"{shippingOption.Name}";
                            shippingOption.Rate += _EShipper1Settings.AdditionalHandlingCharge;

                            System.Diagnostics.Trace.WriteLine("run shippingOptions: " + i++);
                            response.ShippingOptions.Add(shippingOption);
                    }
                }
                else
                {
                    response.AddError(error);
                }

                //Saturday delivery
                if (_EShipper1Settings.CarrierServicesOffered.Contains("[sa]"))
                {
                    requestString = CreateRequest(_EShipper1Settings.AccessKey, _EShipper1Settings.Username, _EShipper1Settings.Password, getShippingOptionRequest,
                        _EShipper1Settings.CustomerClassification, _EShipper1Settings.PickupType, _EShipper1Settings.PackagingType, true);
                    if (_EShipper1Settings.Tracing)
                        _traceMessages.AppendLine("Request:").AppendLine(requestString);

                    responseXml = DoRequest(_EShipper1Settings.Url, requestString);
                    if (_EShipper1Settings.Tracing)
                        _traceMessages.AppendLine("Response:").AppendLine(responseXml);

                    error = string.Empty;
                    var saturdayDeliveryShippingOptions = ParseResponse(responseXml, ref error);
                    if (string.IsNullOrEmpty(error))
                    {
                        foreach (var shippingOption in saturdayDeliveryShippingOptions)
                        {
                            shippingOption.Name =
                                $"{(shippingOption.Name.ToLower().StartsWith("EShipper1") ? string.Empty : "EShipper ")}{shippingOption.Name} - Saturday Delivery";
                            shippingOption.Rate += _EShipper1Settings.AdditionalHandlingCharge;
                            //response.ShippingOptions.Add(shippingOption);
                        }
                    }
                    else
                        response.AddError(error);
                }

                if (response.ShippingOptions.Any())
                    response.Errors.Clear();
            }
            catch (Exception exc)
            {
                response.AddError($"EShipper Service is currently unavailable, try again later. {exc.Message}");
            }
            finally
            {
                if (_EShipper1Settings.Tracing && _traceMessages.Length > 0)
                {
                    var shortMessage =
                        $"EShipper Get Shipping Options for customer {getShippingOptionRequest.Customer.Email}.  {getShippingOptionRequest.Items.Count} item(s) in cart";
                    _logger.Information(shortMessage, new Exception(_traceMessages.ToString()), getShippingOptionRequest.Customer);
                }
            }

            return response;
        }

        /// <summary>
        /// Gets fixed shipping rate (if shipping rate computation method allows it and the rate can be calculated before checkout).
        /// </summary>
        /// <param name="getShippingOptionRequest">A request for getting shipping options</param>
        /// <returns>Fixed shipping rate; or null in case there's no fixed shipping rate</returns>
        public decimal? GetFixedRate(GetShippingOptionRequest getShippingOptionRequest)
        {
            return null;
        }

        /// <summary>
        /// Gets a configuration page URL
        /// </summary>
        public override string GetConfigurationPageUrl()
        {
            return $"{_webHelper.GetStoreLocation()}Admin/ShippingEShipper1/Configure";
        }

        /// <summary>
        /// Install plugin
        /// </summary>
        public override void Install()
        {
            //settings
            var settings = new EShipper1Settings
            {
                Url = "http://web.eshipper.com/rpc2",
                CustomerClassification = EShipper1CustomerClassification.Retail,
                PickupType = EShipper1PickupType.OneTimePickup,
                PackagingType = EShipper1PackagingType.ExpressBox,
                PackingPackageVolume = 5184,
                PackingType = PackingType.PackByDimensions,
                PassDimensions = true,
            };
            _settingService.SaveSetting(settings);

            //locales
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Url", "URL");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Url.Hint", "Specify EShipper URL.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccessKey", "Access Key");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccessKey.Hint", "Specify EShipper access key.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccountNumber", "Account number");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccountNumber.Hint", "Specify EShipper account number (required to get negotiated rates).");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Username", "Username");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Username.Hint", "Specify EShipper username.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Password", "Password");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Password.Hint", "Specify EShipper password.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AdditionalHandlingCharge", "Additional handling charge");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AdditionalHandlingCharge.Hint", "Enter additional handling fee to charge your customers.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.InsurePackage", "Insure package");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.InsurePackage.Hint", "Check to insure packages.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.CustomerClassification", "EShipper1 Customer Classification");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.CustomerClassification.Hint", "Choose customer classification.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PickupType", "EShipper1 Pickup Type");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PickupType.Hint", "Choose EShipper pickup type.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackagingType", "EShipper1 Packaging Type");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackagingType.Hint", "Choose EShipper packaging type.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AvailableCarrierServices", "Carrier Services");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AvailableCarrierServices.Hint", "Select the services you want to offer to customers.");
            //tracker events
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Departed", "Departed");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.ExportScanned", "Export scanned");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.OriginScanned", "Origin scanned");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Arrived", "Arrived");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.NotDelivered", "Not delivered");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Booked", "Booked");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Delivered", "Delivered");
            //packing
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PassDimensions", "Pass dimensions");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PassDimensions.Hint", "Check if you want to pass package dimensions when requesting rates.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingType", "Packing type");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingType.Hint", "Choose preferred packing type.");
            _localizationService.AddOrUpdatePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByDimensions", "Pack by dimensions");
            _localizationService.AddOrUpdatePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByOneItemPerPackage", "Pack by one item per package");
            _localizationService.AddOrUpdatePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByVolume", "Pack by volume");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingPackageVolume", "Package volume");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingPackageVolume.Hint", "Enter your package volume.");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Tracing", "Tracing");
            _localizationService.AddOrUpdatePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Tracing.Hint", "Check if you want to record plugin tracing in System Log. Warning: The entire request and response XML will be logged (including AccessKey/UserName,Password). Do not leave this enabled in a production environment.");

            base.Install();
        }

        /// <summary>
        /// Uninstall plugin
        /// </summary>
        public override void Uninstall()
        {
            //settings
            _settingService.DeleteSetting<EShipper1Settings>();

            //locales
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Url");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Url.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccessKey");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccessKey.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccountNumber");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AccountNumber.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Username");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Username.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Password");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Password.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AdditionalHandlingCharge");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AdditionalHandlingCharge.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.InsurePackage");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.InsurePackage.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.CustomerClassification");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.CustomerClassification.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PickupType");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PickupType.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackagingType");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackagingType.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AvailableCarrierServices");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.AvailableCarrierServices.Hint");
            //tracker events
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Departed");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.ExportScanned");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.OriginScanned");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Arrived");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.NotDelivered");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Booked");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Tracker.Delivered");
            //packing
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PassDimensions");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PassDimensions.Hint");
            _localizationService.DeletePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByDimensions");
            _localizationService.DeletePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByOneItemPerPackage");
            _localizationService.DeletePluginLocaleResource("Enums.Nop.Plugin.Shipping.EShipper1.PackingType.PackByVolume");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingType");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingType.Hint");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingPackageVolume");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.PackingPackageVolume.Hint");
            //tracing
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Tracing");
            _localizationService.DeletePluginLocaleResource("Plugins.Shipping.EShipper1.Fields.Tracing.Hint");

            base.Uninstall();
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets a shipping rate computation method type
        /// </summary>
        public ShippingRateComputationMethodType ShippingRateComputationMethodType
        {
            get { return ShippingRateComputationMethodType.Realtime; }
        }

        /// <summary>
        /// Gets a shipment tracker
        /// </summary>
        public IShipmentTracker ShipmentTracker
        {
            get { return new EShipper1ShipmentTracker(_logger, _localizationService, _EShipper1Settings); }
        }

        #endregion
    }
}