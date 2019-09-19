/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Scripts/Products/js/qtyButton.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Scripts/Products/js/qtyButton.js":
/*!******************************************!*\
  !*** ./Scripts/Products/js/qtyButton.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

    console.log("calculatedPriceStr", calculatedPriceStr);
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

  recalculateTotalCost(oldValue); //console.log('oldValue: ' + oldValue);
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
    console.log($(this).siblings('.shopperCartEachItem').html()); //$('div.shopperCartEachItem').siblings('').fadeIn(500); 
    //$('.shopperCartEachItem').fadeIn(500); 

    $('.itemHasChangedMsg').fadeIn(500);
    $('.shopperCartEachItem').fadeIn(500);
  } //console.log(newVal);
  //console.log(priceValue);
  //console.log(priceValue * newVal);
  //console.log("===========");

}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9Qcm9kdWN0cy9qcy9xdHlCdXR0b24uanMiXSwibmFtZXMiOlsiJCIsImNsaWNrIiwiJGJ1dHRvbiIsIm9sZFZhbHVlIiwicGFyZW50IiwiZmluZCIsInZhbCIsImJ1dHRvblZhbHVlIiwibmV3VmFsIiwiY2hhbmdlUXR5TnVtYmVyIiwicmVjYWxjdWxhdGVUb3RhbENvc3QiLCJrZXl1cCIsIiRxdHlJbnB1dCIsImNvbnNvbGUiLCJsb2ciLCJNYXRoIiwicm91bmQiLCJvbiIsIiRzcGFuIiwicGFyc2VGbG9hdCIsInByaWNlU3BhbiIsImh0bWwiLCJ0aGF0IiwicHJpY2VWYWx1ZSIsInJlcGxhY2UiLCJ0b0ZpeGVkIiwic2libGluZ3MiLCJmYWRlSW4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNB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QUFDbEMsTUFBSVksU0FBUyxHQUFHcEIsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxDQUFrQnFCLElBQWxCLEVBQWhCO0FBQ0EsTUFBSUMsSUFBSSxHQUFHLElBQVg7O0FBQ0EsTUFBSUYsU0FBSixFQUFlO0FBQ1gsUUFBSUcsVUFBVSxHQUFHdkIsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxDQUFrQnFCLElBQWxCLEdBQXlCRyxPQUF6QixDQUFpQyxHQUFqQyxFQUFzQyxFQUF0QyxFQUEwQ0EsT0FBMUMsQ0FBa0QsR0FBbEQsRUFBdUQsRUFBdkQsQ0FBakI7QUFDQUQsY0FBVSxHQUFHLENBQUNSLElBQUksQ0FBQ0MsS0FBTCxDQUFXTyxVQUFVLEdBQUdmLE1BQWIsR0FBc0IsR0FBakMsSUFBd0MsR0FBekMsRUFBOENpQixPQUE5QyxDQUFzRCxDQUF0RCxDQUFiO0FBQ0F6QixLQUFDLENBQUMsV0FBRCxDQUFELENBQWVxQixJQUFmLENBQW9CLGdCQUFnQkUsVUFBcEM7QUFDSCxHQUpELE1BSU87QUFFSDtBQUNBVixXQUFPLENBQUNDLEdBQVIsQ0FBWWQsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRMEIsUUFBUixDQUFpQixzQkFBakIsRUFBeUNMLElBQXpDLEVBQVosRUFIRyxDQUlIO0FBQ0E7O0FBQ0FyQixLQUFDLENBQUMsb0JBQUQsQ0FBRCxDQUF3QjJCLE1BQXhCLENBQStCLEdBQS9CO0FBQ0EzQixLQUFDLENBQUMsc0JBQUQsQ0FBRCxDQUEwQjJCLE1BQTFCLENBQWlDLEdBQWpDO0FBRUgsR0FoQmlDLENBa0JsQztBQUNBO0FBQ0E7QUFDQTs7QUFDSCxDIiwiZmlsZSI6ImpzX3F0eUJ1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vU2NyaXB0cy9Qcm9kdWN0cy9qcy9xdHlCdXR0b24uanNcIik7XG4iLCIvLy8vIFNwaW5uZXIgQnV0dG9uIGZvciBRdHlcclxuLy8kKFwiLnF0eUJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbi8vICAgIHZhciAkYnV0dG9uID0gJCh0aGlzKTtcclxuLy8gICAgdmFyIG9sZFZhbHVlID0gJGJ1dHRvbi5wYXJlbnQoKS5maW5kKFwiLnF0eS1pbnB1dFwiKS52YWwoKTtcclxuLy8gICAgdmFyIGJ1dHRvblZhbHVlID0gJGJ1dHRvbi52YWwoKTtcclxuLy8gICAgdmFyIG5ld1ZhbCA9IGNoYW5nZVF0eU51bWJlcihvbGRWYWx1ZSwgYnV0dG9uVmFsdWUpO1xyXG4vLyAgICByZWNhbGN1bGF0ZVRvdGFsQ29zdChuZXdWYWwpO1xyXG4vLyAgICAkYnV0dG9uLnBhcmVudCgpLmZpbmQoXCIucXR5LWlucHV0XCIpLnZhbChuZXdWYWwpO1xyXG4vL30pO1xyXG5cclxuLy8vLyB1cGRhdGUgdGhlIHN1YnRvdGFsIHdoZW4gdXNlciB0eXBlIGluIHF0eSBpbiBxdHkgaW5wdXQgYm94XHJcbi8vJChcIi5xdHktaW5wdXRcIikua2V5dXAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICB2YXIgJHF0eUlucHV0ID0gJCh0aGlzKTtcclxuLy8gICAgdmFyIG9sZFZhbHVlID0gJHF0eUlucHV0LnZhbCgpO1xyXG5cclxuLy8gICAgaWYgKG9sZFZhbHVlICUgMSAhPT0gMCkge1xyXG4vLyAgICAgICAgb2xkVmFsdWUgPSBNYXRoLnJvdW5kKG9sZFZhbHVlKTtcclxuLy8gICAgICAgICQoXCIucXR5LWlucHV0XCIpLnZhbChvbGRWYWx1ZSk7XHJcbi8vICAgICAgICByZWNhbGN1bGF0ZVRvdGFsQ29zdChvbGRWYWx1ZSk7XHJcbi8vICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICByZWNhbGN1bGF0ZVRvdGFsQ29zdChvbGRWYWx1ZSk7XHJcbi8vICAgIH1cclxuLy99KTtcclxuXHJcbi8vLy8gZ3JhYiB0aGUgcHJpY2UgcGVyIHVuaXQgZnJvbSBzcGFuIHRhZywgdXBkYXRlIGFuZCBjYWxjdWxhdGUgdGhlIHN1YnRvdGFsLlxyXG4vLyQoJ1tjbGFzc149XCJwcmljZS12YWx1ZVwiXScpLm9uKCdET01TdWJ0cmVlTW9kaWZpZWQnLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgIHZhciAkc3BhbiA9ICQoJy5xdHktaW5wdXQnKTtcclxuLy8gICAgdmFyIG9sZFZhbHVlID0gJChcIi5xdHktaW5wdXRcIikudmFsKCk7XHJcblxyXG4vLyAgICByZWNhbGN1bGF0ZVRvdGFsQ29zdChvbGRWYWx1ZSk7XHJcbi8vICAgIC8vIGNvbnNvbGUubG9nKCdvbGRWYWx1ZTogJyArIG9sZFZhbHVlKTtcclxuLy99KTtcclxuXHJcbi8vLy8gY2hhbmdlIHRoZSBRdHkgaW5wdXQgYm94IGJ5IGFkZGluZyBvciBtaW51cyAxXHJcbi8vZnVuY3Rpb24gY2hhbmdlUXR5TnVtYmVyKG9sZFZhbHVlLCBidXR0b25WYWx1ZSkge1xyXG4vLyAgICBpZiAoYnV0dG9uVmFsdWUgPT09IFwiICsgXCIpIHtcclxuLy8gICAgICAgIG9sZFZhbHVlID0gb2xkVmFsdWUgPT09IFwiTmFOXCIgfHwgb2xkVmFsdWUgPT09IFwiXCIgPyAwIDogb2xkVmFsdWU7XHJcbi8vICAgICAgICB2YXIgbmV3VmFsID0gcGFyc2VGbG9hdChvbGRWYWx1ZSkgKyAxO1xyXG4vLyAgICB9IGVsc2Uge1xyXG5cclxuLy8gICAgICAgIGlmIChvbGRWYWx1ZSA+IDApIHtcclxuLy8gICAgICAgICAgICBuZXdWYWwgPSBwYXJzZUZsb2F0KG9sZFZhbHVlKSAtIDE7XHJcbi8vICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgIG5ld1ZhbCA9IDA7XHJcbi8vICAgICAgICB9XHJcbi8vICAgIH1cclxuXHJcbi8vICAgIHJldHVybiBuZXdWYWw7XHJcbi8vfVxyXG5cclxuLy8vLyBjYWxjdWxhdGUgdGhlIHRvdGFsIGNvc3QgYW5kIGNoYW5nZSB0aGUgc3VidG90YWwgbGFiZWwgYm94LlxyXG4vL2Z1bmN0aW9uIHJlY2FsY3VsYXRlVG90YWxDb3N0KG5ld1ZhbCkge1xyXG4vLyAgICB2YXIgcHJpY2VWYWx1ZSA9ICQoJy5wcmljZXMgc3BhbicpLmh0bWwoKS5yZXBsYWNlKFwiJFwiLCBcIlwiKS5yZXBsYWNlKFwiLFwiLCBcIlwiKTtcclxuLy8gICAgcHJpY2VWYWx1ZSA9IFwiU3ViVG90YWw6ICRcIiArIE1hdGgucm91bmQoKHByaWNlVmFsdWUgKiBuZXdWYWwpICogMTAwKSAvIDEwMDtcclxuLy8gICAgcHJpY2VWYWx1ZSA9IFwiXCI7XHJcbi8vICAgICQoJyNzdWJUb3RhbCcpLmh0bWwocHJpY2VWYWx1ZSk7XHJcbi8vICAgIGNvbnNvbGUubG9nKFwidGVzdFwiKTtcclxuLy8gICAgLy90ZXN0XHJcbi8vfVxyXG5cclxuXHJcbi8vIHNwaW5uZXIgZm9yIFF0eVxyXG4kKFwiLnF0eUJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJGJ1dHRvbiA9ICQodGhpcyk7XHJcbiAgICB2YXIgb2xkVmFsdWUgPSAkYnV0dG9uLnBhcmVudCgpLmZpbmQoXCIucXR5LWlucHV0XCIpLnZhbCgpO1xyXG4gICAgdmFyIGJ1dHRvblZhbHVlID0gJGJ1dHRvbi52YWwoKTtcclxuICAgIHZhciBuZXdWYWwgPSBjaGFuZ2VRdHlOdW1iZXIob2xkVmFsdWUsIGJ1dHRvblZhbHVlKTtcclxuICAgIHJlY2FsY3VsYXRlVG90YWxDb3N0KG5ld1ZhbCk7XHJcbiAgICAkYnV0dG9uLnBhcmVudCgpLmZpbmQoXCIucXR5LWlucHV0XCIpLnZhbChuZXdWYWwpO1xyXG59KTtcclxuJChcIi5xdHktaW5wdXRcIikua2V5dXAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRxdHlJbnB1dCA9ICQodGhpcyk7XHJcbiAgICB2YXIgb2xkVmFsdWUgPSAkcXR5SW5wdXQudmFsKCk7IC8vdmFyIGJ1dHRvblZhbHVlID0gJGJ1dHRvbi52YWwoKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhvbGRWYWx1ZSArIFwiL1wiKTtcclxuXHJcbiAgICBpZiAob2xkVmFsdWUgJSAxICE9IDApIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhvbGRWYWx1ZSArIFwiIGlzIG5vdCBhIGludGVnZXJcIik7XHJcbiAgICAgICAgb2xkVmFsdWUgPSBNYXRoLnJvdW5kKG9sZFZhbHVlKTtcclxuICAgICAgICAkKFwiLnF0eS1pbnB1dFwiKS52YWwob2xkVmFsdWUpO1xyXG4gICAgICAgIHJlY2FsY3VsYXRlVG90YWxDb3N0KG9sZFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVjYWxjdWxhdGVUb3RhbENvc3Qob2xkVmFsdWUpO1xyXG4gICAgfSAvL3ZhciBuZXdWYWwgPSBjaGFuZ2VRdHlOdW1iZXIob2xkVmFsdWUsIFwiXCIpO1xyXG59KTtcclxuXHJcbiQoJ1tjbGFzc149XCJwcmljZS12YWx1ZVwiXScpLm9uKCdET01TdWJ0cmVlTW9kaWZpZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHNwYW4gPSAkKCcucXR5LWlucHV0Jyk7XHJcbiAgICB2YXIgb2xkVmFsdWUgPSAkKFwiLnF0eS1pbnB1dFwiKS52YWwoKTsgLy92YXIgYnV0dG9uVmFsdWUgPSAkYnV0dG9uLnZhbCgpO1xyXG4gICAgLy92YXIgbmV3VmFsID0gY2hhbmdlUXR5TnVtYmVyKG9sZFZhbHVlLCBidXR0b25WYWx1ZSk7XHJcblxyXG4gICAgcmVjYWxjdWxhdGVUb3RhbENvc3Qob2xkVmFsdWUpO1xyXG4gICAgLy9jb25zb2xlLmxvZygnb2xkVmFsdWU6ICcgKyBvbGRWYWx1ZSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY2hhbmdlUXR5TnVtYmVyKG9sZFZhbHVlLCBidXR0b25WYWx1ZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhvbGRWYWx1ZSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKGJ1dHRvblZhbHVlKTtcclxuICAgIGlmIChidXR0b25WYWx1ZSA9PSBcIiArIFwiKSB7XHJcbiAgICAgICAgb2xkVmFsdWUgPSBvbGRWYWx1ZSA9PSBcIk5hTlwiIHx8IG9sZFZhbHVlID09IFwiXCIgPyAwIDogb2xkVmFsdWU7XHJcbiAgICAgICAgdmFyIG5ld1ZhbCA9IHBhcnNlRmxvYXQob2xkVmFsdWUpICsgMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG9sZFZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICBuZXdWYWwgPSBwYXJzZUZsb2F0KG9sZFZhbHVlKSAtIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3VmFsID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld1ZhbDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVjYWxjdWxhdGVUb3RhbENvc3QobmV3VmFsKSB7XHJcbiAgICB2YXIgcHJpY2VTcGFuID0gJCgnLnByaWNlcyBzcGFuJykuaHRtbCgpO1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgaWYgKHByaWNlU3Bhbikge1xyXG4gICAgICAgIHZhciBwcmljZVZhbHVlID0gJCgnLnByaWNlcyBzcGFuJykuaHRtbCgpLnJlcGxhY2UoXCIkXCIsIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiXCIpO1xyXG4gICAgICAgIHByaWNlVmFsdWUgPSAoTWF0aC5yb3VuZChwcmljZVZhbHVlICogbmV3VmFsICogMTAwKSAvIDEwMCkudG9GaXhlZCgyKTtcclxuICAgICAgICAkKCcjc3ViVG90YWwnKS5odG1sKFwiU3ViVG90YWw6ICRcIiArIHByaWNlVmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8kKHRoaXMpLnNpYmxpbmdzKCcuc2hvcHBlckNhcnRFYWNoSXRlbScpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLnNpYmxpbmdzKCcuc2hvcHBlckNhcnRFYWNoSXRlbScpLmh0bWwoKSk7XHJcbiAgICAgICAgLy8kKCdkaXYuc2hvcHBlckNhcnRFYWNoSXRlbScpLnNpYmxpbmdzKCcnKS5mYWRlSW4oNTAwKTsgXHJcbiAgICAgICAgLy8kKCcuc2hvcHBlckNhcnRFYWNoSXRlbScpLmZhZGVJbig1MDApOyBcclxuICAgICAgICAkKCcuaXRlbUhhc0NoYW5nZWRNc2cnKS5mYWRlSW4oNTAwKTsgXHJcbiAgICAgICAgJCgnLnNob3BwZXJDYXJ0RWFjaEl0ZW0nKS5mYWRlSW4oNTAwKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhuZXdWYWwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhwcmljZVZhbHVlKTtcclxuICAgIC8vY29uc29sZS5sb2cocHJpY2VWYWx1ZSAqIG5ld1ZhbCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiPT09PT09PT09PT1cIik7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==