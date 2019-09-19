// Spinner Button for Qty
$(".qtyButton").click(function () {
    var $button = $(this);
    var oldValue = $button.parent().find(".qty-input").val();
    var buttonValue = $button.val();
    var newVal = changeQtyNumber(oldValue, buttonValue);

    console.log("calculatedPriceStr", calculatedPriceStr);

    recalculateTotalCost(newVal);
    $button.parent().find(".qty-input").val(newVal);
});

// update the subtotal when user type in qty in qty input box
$(".qty-input").keyup(function () {
    var $qtyInput = $(this);
    var oldValue = $qtyInput.val();

    if (oldValue % 1 !== 0) {
        oldValue = Math.round(oldValue);
        $(".qty-input").val(oldValue);
        recalculateTotalCost(oldValue);
    } else {
        recalculateTotalCost(oldValue);
    }
});

// grab the price per unit from span tag, update and calculate the subtotal.
$('[class^="price-value"]').on('DOMSubtreeModified', function () {
    var $span = $('.qty-input');
    var oldValue = $(".qty-input").val();

    recalculateTotalCost(oldValue);
    // console.log('oldValue: ' + oldValue);
});

// change the Qty input box by adding or minus 1
function changeQtyNumber(oldValue, buttonValue) {
    if (buttonValue === " + ") {
        oldValue = oldValue === "NaN" || oldValue === "" ? 0 : oldValue;
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

// calculate the total cost and change the subtotal label box.
function recalculateTotalCost(newVal) {
    var priceValue = $('.prices span').html().replace("$", "").replace(",", "");
    priceValue = "SubTotal: $" + Math.round((priceValue * newVal) * 100) / 100;
    priceValue = "";
    $('#subTotal').html(priceValue);
}