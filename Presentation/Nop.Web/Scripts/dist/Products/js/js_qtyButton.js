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


// spinner for Qty
$(".qtyButton").click(function () {
    var $button = $(this);
    var oldValue = $button.parent().find(".qty-input").val();
    var buttonValue = $button.val();
    var newVal = changeQtyNumber(oldValue, buttonValue);
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
        recalculateTotalCost(oldValue);
    } else {
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

function recalculateTotalCost(newVal) {
    var priceSpan = $('.prices span').html();
    var that = this;
    if (priceSpan) {
        var priceValue = $('.prices span').html().replace("$", "").replace(",", "");
        priceValue = (Math.round(priceValue * newVal * 100) / 100).toFixed(2);
        $('#subTotal').html("SubTotal: $" + priceValue);
    } else {

        //$(this).siblings('.shopperCartEachItem').fadeIn(1000);
        console.log($(this).siblings('.shopperCartEachItem').html());
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
