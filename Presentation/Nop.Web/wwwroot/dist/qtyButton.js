//// Spinner Button for Qty
//$(".qtyButton").click(function () {
//    var $button = $(this);
//    var oldValue = $button.parent().find(".qty-input").val();
//    var buttonValue = $button.val();
//    var newVal = changeQtyNumber(oldValue, buttonValue);
//    recalculateTotalCost(newVal);
//    $button.parent().find(".qty-input").val(newVal);
//});

//// update the subtotal when user type in qty in qty input box
//$(".qty-input").keyup(function () {
//    var $qtyInput = $(this);
//    var oldValue = $qtyInput.val();

//    if (oldValue % 1 !== 0) {
//        oldValue = Math.round(oldValue);
//        $(".qty-input").val(oldValue);
//        recalculateTotalCost(oldValue);
//    } else {
//        recalculateTotalCost(oldValue);
//    }
//});

//// grab the price per unit from span tag, update and calculate the subtotal.
//$('[class^="price-value"]').on('DOMSubtreeModified', function () {
//    var $span = $('.qty-input');
//    var oldValue = $(".qty-input").val();

//    recalculateTotalCost(oldValue);
//    // console.log('oldValue: ' + oldValue);
//});

//// change the Qty input box by adding or minus 1
//function changeQtyNumber(oldValue, buttonValue) {
//    if (buttonValue === " + ") {
//        oldValue = oldValue === "NaN" || oldValue === "" ? 0 : oldValue;
//        var newVal = parseFloat(oldValue) + 1;
//    } else {

//        if (oldValue > 0) {
//            newVal = parseFloat(oldValue) - 1;
//        } else {
//            newVal = 0;
//        }
//    }

//    return newVal;
//}

//// calculate the total cost and change the subtotal label box.
//function recalculateTotalCost(newVal) {
//    var priceValue = $('.prices span').html().replace("$", "").replace(",", "");
//    priceValue = "SubTotal: $" + Math.round((priceValue * newVal) * 100) / 100;
//    priceValue = "";
//    $('#subTotal').html(priceValue);
//    console.log("test");
//    //test
//}


/* ========== plus and minus button spinner for Qty =============== */
$(".qtyButton").click(function () {
    var $button = $(this);
    var oldValue = $button.parent().find(".qty-input").val();
    var buttonValue = $button.val();
    var newVal = changeQtyNumber(oldValue, buttonValue);
    if (typeof (paUrl) != 'undefined') {
        ajaxGetProductInfo(paUrl);
    }
    recalculateTotalCost(newVal);
    $button.parent().find(".qty-input").val(newVal);
});
$(".qty-input").keyup(function () {
    var $qtyInput = $(this);
    var oldValue = $qtyInput.val(); //var buttonValue = $button.val();

    console.log(oldValue + "/");

    if (oldValue % 1 != 0) {
        console.log(oldValue + " is not a integer");
        oldValue = Math.round(oldValue);
        $(".qty-input").val(oldValue);
        if (typeof (paUrl) != 'undefined') {
            ajaxGetProductInfo(paUrl);
        }
        recalculateTotalCost(oldValue);
    } else {
        if (typeof (paUrl) != 'undefined') {
            ajaxGetProductInfo(paUrl);
        }
        recalculateTotalCost(oldValue);
    } //var newVal = changeQtyNumber(oldValue, "");
});

$('[class^="price-value"]').on('DOMSubtreeModified', function () {
    var $span = $('.qty-input');
    var oldValue = $(".qty-input").val(); //var buttonValue = $button.val();
    //var newVal = changeQtyNumber(oldValue, buttonValue);

    recalculateTotalCost(oldValue);
    //console.log('oldValue: ' + oldValue);
});

function changeQtyNumber(oldValue, buttonValue) {
    //console.log(oldValue);
    //console.log(buttonValue);
    if (buttonValue == " + ") {
        oldValue = oldValue == "NaN" || oldValue == "" ? 0 : oldValue;
        var newVal = parseFloat(oldValue) + 1;
    } else {
        if (oldValue > 0) {
            newVal = parseFloat(oldValue) - 1;
        } else {
            newVal = 0;
        }
    }

    return newVal;
}

// recalculate Total Cost in product frontend
function recalculateTotalCost(newVal) {
    var priceSpan = $('.prices span').html();
    //  console.log("prices span: ", priceSpan);
    var that = this;
    if (priceSpan) {
        var priceValue = priceSpan.replace(/\$|\$\$/gi, "").replace(",", "");
        priceValue = (Math.round(priceValue * newVal * 100) / 100).toFixed(2);
        $('#subTotal').html("SubTotal: $" + priceValue);
    } else {

        //$(this).siblings('.shopperCartEachItem').fadeIn(1000);
        //console.log($(this).siblings('.shopperCartEachItem').html());
        //$('div.shopperCartEachItem').siblings('').fadeIn(500); 
        //$('.shopperCartEachItem').fadeIn(500); 
        $('.itemHasChangedMsg').fadeIn(500); 
        $('.shopperCartEachItem').fadeIn(500);

    }

    //console.log(newVal);
    //console.log(priceValue);
    //console.log(priceValue * newVal);
    //console.log("===========");
}


// ==== below is for coroplast sign board frontend javascript / jquery ===


function findPrice(selectedSize) {
    var returnPriceStr = [];
    console.log("selectedSize: " + selectedSize);
    var selectSizeArr = selectedSize.split("x");

    coroplastPriceList.forEach(function (line, index) {
        //console.log(index, line);

        var priceListLineArr = line.split(',');
        var size = (priceListLineArr[0]).split("x");

        //console.log(index, line);
        //console.log(size[0] == selectSizeArr[0], size[1] == selectSizeArr[1]);

        if (size[0] == selectSizeArr[0] && size[1] == selectSizeArr[1]) {

            console.log(priceListLineArr[priceListLineArr.length - 1]);
            returnPriceStr.push(priceListLineArr[priceListLineArr.length - 1] + ":" + priceListLineArr[7]);
        }

    })

    return returnPriceStr.toString();
}

// ====== coroplast sign board calculation below =====

var size = "";
var height = "";
var sizeBoxVisible = "";
var wholeSizeCutTotalPrice = 0.00;
var halfSizeCutTotalPrice = 0.00;

var wholeSizeBoardQTYNeeded = 0;
var halfSizeQtyNeeded = 0;
var wholeSizeQtyNeeded = 0;
var wholeSizeCutDivisionQty = 0;

qty = parseInt(qty);
console.log("Qty of Whole Board Size Yield: " + wholeSizeCutMaxYield);
console.log("Qty of Half Board Size Yield: " + halfSizeCutMaxYield);

var calculatedPriceStr = "";

function calculatePrice(data, qty) {
    var adminCommentStr = data.adminComment;
    var size = ($('#Size select').children(':selected').text()).split(" ")[0].replace(/"/g, '');
    var width = ($('#Width select').children(':selected').text()).split(" ")[0].replace(/"/g, '');
    var height = ($('#Height select').children(':selected').text()).split(" ")[0].replace(/"/g, '');
    var sizeBoxVisible = $('#Size').parent().css('display');
    totalPrice = 0;

    if (sizeBoxVisible == "none") {
        size = width + "x" + height;
        data.customSize = 'true';
    }

    if (!coroplastPriceList) {
        coroplastPriceList = adminCommentStr.split(/\r?\n/);
        coroplastPriceList.sort();
        calculatedPriceStr = findPrice(size);
    } else {
        calculatedPriceStr = findPrice(size);
    }

    console.log("================= detail pricing ====================");
    console.log("calculatedPriceStr", calculatedPriceStr);

    if (data.customSize != 'true') {
        //halfSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[0]).split(":")[1]);
        //wholeSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[1]).split(":")[1]);
        halfSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[0]).split(":")[1]);
        wholeSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[1]).split(":")[1]);
        halfSizeCutPrice = parseFloat((calculatedPriceStr.split(",")[0]).split(":")[0]);
        wholeSizeCutPrice = parseFloat((calculatedPriceStr.split(",")[1]).split(":")[0]);

        calculateWholeHalfSizeQtyNeed(qty, wholeSizeCutMaxYield);

        totalPrice = calculatePerBoardPriceFromDbTable(calculatedPriceStr, wholeSizeQtyNeeded, halfSizeQtyNeeded);

    } else {


        // Temporary Hard code pricing items
        var boardSizeArr = ["48x96", "48x48"]; // whole board, and half board;

        var sheetCost = 12.30;
        var materialCostWholeSizePerPcs = 0.00;
        var materialCostHalfSizePerPcs = 0.00;
        var deminsionOfCuttedWholeBoardPerPcs = 0.00;
        var deminsionOfCuttedHalfBoardPerPcs = 0.00;
        var paraimeterOfCuttedBoardPerPcs = 0.00;
        var paraimeterOfCuttedHalfBoardPerPcs = 0.00;

        wholeBoardSizeWidth = parseInt(boardSizeArr[0].split("x")[0]);
        wholeBoardSizeHeight = parseInt(boardSizeArr[0].split("x")[1]);
        halfBoardSizeWidth = parseInt(boardSizeArr[1].split("x")[0]);
        halfBoardSizeHeight = parseInt(boardSizeArr[1].split("x")[1]);

        // Remarks:  Need to get the floor number for Max Yield 
        wholeSizeCutMaxYield = parseInt(Math.floor(wholeBoardSizeWidth / width) * Math.floor(wholeBoardSizeHeight / height)); 
        halfSizeCutMaxYield = parseInt(Math.floor(halfBoardSizeWidth / width) * Math.floor(halfBoardSizeHeight / height)); 
        
        materialCostWholeSizePerPcs = sheetCost / wholeSizeCutMaxYield; 
        materialCostHalfSizePerPcs = sheetCost / halfSizeCutMaxYield;

        // calculation ex.: 12x24 / 144
        deminsionOfCuttedWholeBoardPerPcs = width * height / (wholeBoardSizeWidth + wholeBoardSizeHeight);  

        // calculation ex.: 12x24 / 144 (this calculation is using the whole board deminsion as base, so same as whole board)
        deminsionOfCuttedHalfBoardPerPcs = width * height / (wholeBoardSizeWidth + wholeBoardSizeHeight);  

        // will be the same
        paraimeterOfCuttedBoardPerPcs = (parseInt(width) + parseInt(height)) * 2;  // total print vetuk use this to calculate 


        var totalPrice = 0.00;

        var adminCost = 5.00;
        var shippingArrangeCost = 2.00;
        var multipler = 2.25;
        var inkCostPerFt = 0.17;

        var labourPrintCutCostWhole = 12.50;
        var labourPrintCutCostHalf = 11.67;

        var printSetupTimeInMin = 10;
        var printPerSheetFeedingInBoardTimeInMin = 2;
        var printSpeedPerPerimeterInFeetPerHour = 750;

        var printVutekWholeSize = 20.66;
        var printVutekHalfSize = 20.66;

        var inkCostPerPcs = 0;

        // ink cost pcs will be the same with each board.
        inkCostPerPcs = deminsionOfCuttedWholeBoardPerPcs * inkCostPerFt;

        calculatedSizeForMaterialPricing = 0;

        calculateWholeHalfSizeQtyNeed(qty, wholeSizeCutMaxYield);

        //halfSizeCutPrice = parseFloat(materialCostHalfSizePerPcs) + inkCostPerFt + printVutekHalfSize + labourPrintCutCostHalf;
        //wholeSizeCutPrice = parseFloat(materialCostWholeSizePerPcs) + labourPrintCutCostWhole;

        var speedOfTheMachine = 8700; // 9000 inch or 750 ft per hour
        var cutPerBoardMaxYieldCostPerBoardPerFt = 25; // $25 for per hour machine cutting running cost

        // printSetupTimeMin is 10min, printPerSheetTimeInMin
        var cutPerBoardMaxYieldCostPerBoard = printSetupTimeInMin
            + (wholeSizeBoardQTYNeeded * printPerSheetFeedingInBoardTimeInMin) + ((halfSizeQtyNeeded >= 1 ? 2 : 0)) // add 2 min for extra sheet if it is bigger than the max yield
            + (paraimeterOfCuttedBoardPerPcs / speedOfTheMachine);  // paraimeterOfCuttedBoardPerPcs is already calculated as the total with the qty

        console.log("cutPerBoardMaxYieldCostPerBoard: ",cutPerBoardMaxYieldCostPerBoard);

        // var cutPerBoardMaxYieldCost = paraimeterOfCuttedBoardPerPcs / speedOfTheMachine * cutPerBoardMaxYieldCostPerBoardPerFt;
        // console.log("cutPerBoardMaxYieldCost: ", cutPerBoardMaxYieldCost);

        // add all cost for whole size together per pieces, this is according to the spreadsheet calculation
        var manufacturingHalfSizePerUnitCost =
            (materialCostHalfSizePerPcs
            + (printVutekHalfSize / halfSizeCutMaxYield)
            + inkCostPerPcs
            + (cutPerBoardMaxYieldCostPerBoard / 60 * 25 / halfSizeCutMaxYield)
            + labourPrintCutCostHalf
            + adminCost
            + shippingArrangeCost)
            * multipler;

        // add all cost for half size together per pieces, this is according to the spreadsheet calculation
        var manufacturingWholeSizePerUnitCost =
            (materialCostWholeSizePerPcs
            + (printVutekWholeSize / wholeSizeCutMaxYield)
            + inkCostPerPcs
            + (cutPerBoardMaxYieldCostPerBoard / 60 * 25 / wholeSizeCutMaxYield)
            + labourPrintCutCostWhole
            + adminCost
            + shippingArrangeCost)
            * multipler;

        // add halfSize QTY need and wholeSize QTY need together
        halfSizeCutTotalPrice = manufacturingHalfSizePerUnitCost * halfSizeQtyNeeded;
        wholeSizeCutTotalPrice = manufacturingWholeSizePerUnitCost * wholeSizeQtyNeeded;

        console.log("TotalPrice: ", (halfSizeCutTotalPrice + wholeSizeCutTotalPrice));

        totalPrice = halfSizeCutTotalPrice + wholeSizeCutTotalPrice;


        //totalPrice = calculateCustomPerBoardPrice();

        //console.log("halfSizeCutTotalPrice: ", halfSizeCutTotalPrice);
        //console.log("wholeSizeCutTotalPrice: ", wholeSizeCutTotalPrice);

        //console.log("materialCostHalfSizePerPcs: ", materialCostHalfSizePerPcs);
        //console.log("materialCostWholeSizePerPcs: ", materialCostWholeSizePerPcs);
        //console.log("deminsionOfCuttedWholeBoardPerPcs: ", deminsionOfCuttedWholeBoardPerPcs);
    }

    return totalPrice;
}


function calculateWholeHalfSizeQtyNeed(qty, wholeSizeCutMaxYield) {
    if (qty >= wholeSizeCutMaxYield) {
        halfSizeQtyNeeded = 0;
        wholeSizeCutDivisionQty = Math.floor(qty / wholeSizeCutMaxYield);
        wholeSizeQtyNeeded = wholeSizeCutMaxYield * wholeSizeCutDivisionQty;
        wholeSizeBoardQTYNeeded = wholeSizeCutDivisionQty;

        //console.log(wholeSizeCutDivisionQty * wholeSizeCutMaxYield * wholeSizeCutPrice);

        // wholeSizeCutTotalPrice = wholeSizeCutDivisionQty * wholeSizeCutMaxYield * wholeSizeCutPrice;

        if ((qty % wholeSizeCutMaxYield) > 0) {
            var leftOverQty = qty - (wholeSizeCutMaxYield * wholeSizeCutDivisionQty);
            console.log("Qty after deduct by wholeSizeYield of " + wholeSizeCutMaxYield + "x" + wholeSizeCutDivisionQty
                + ": " + (wholeSizeCutMaxYield * wholeSizeCutDivisionQty) + " is " + leftOverQty);

            halfSizeCutTotalPrice = halfSizeCutPrice * leftOverQty;
            halfSizeQtyNeeded = leftOverQty;
            //console.log("halfSizeCutTotalPrice: ", halfSizeCutTotalPrice);
        }
    }

    else {
        wholeSizeQtyNeeded = 0;
        halfSizeQtyNeeded = qty;
        wholeSizeBoardQTYNeeded = 0;
        halfSizeCutTotalPrice = halfSizeCutPrice * qty;
    }

    console.log("halfSizeQtyNeeded: ", halfSizeQtyNeeded);
    console.log("wholeSizeQtyNeeded: ", wholeSizeQtyNeeded);
    console.log("wholeSizeBoardQTYNeeded: ", wholeSizeBoardQTYNeeded);
    //console.log("wholeSizeCutDivisionQty: ", wholeSizeCutDivisionQty);

    return "halfSizeQtyNeeded:", halfSizeQtyNeeded, "wholeSizeBoardQTYNeeded:", wholeSizeBoardQTYNeeded;

}


function calculateCustomPerBoardPrice(wholeSizeCutDivisionQty, wholeMaxYieldQty, halfSizeQtyNeeded) {


    var manufacturingHalfSizePerUnitCost = (materialCostHalfSizePerPcs + printVutekHalfSize + adminCost + shippingArrangeCost) * multipler;
    var manufacturingWholeSizePerUnitCost = (materialCostWholeSizePerPcs + printVutekWholeSize + adminCost + shippingArrangeCost) * multipler;

    var calculatedSizeForMaterialPricing = 0.00; // calculated total size in sq ft for Ink cost and etc.

    halfSizeCutTotalPrice = manufacturingHalfSizePerUnitCost * halfSizeQtyNeeded;
    wholeSizeCutTotalPrice = manufacturingWholeSizePerUnitCost * wholeSizeQtyNeeded * wholeSizeCutDivisionQty;
    console.log("TotalPrice: ", (halfSizeCutTotalPrice + wholeSizeCutTotalPrice));
    return totalPrice;
}


function calculatePerBoardPriceFromDbTable(calculatedPriceStr, wholeSizeQtyNeeded, halfSizeQtyNeeded) {
    halfSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[0]).split(":")[1]);
    wholeSizeCutMaxYield = parseInt((calculatedPriceStr.split(",")[1]).split(":")[1]);
    halfSizeCutPrice = parseFloat((calculatedPriceStr.split(",")[0]).split(":")[0]);
    wholeSizeCutPrice = parseFloat((calculatedPriceStr.split(",")[1]).split(":")[0]);
    return (halfSizeCutPrice * halfSizeQtyNeeded) + (wholeSizeCutPrice * wholeSizeQtyNeeded);
}