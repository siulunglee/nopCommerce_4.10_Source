$(function () {
    setTimeout(function () {
        ReactDOM.render(React.createElement(plusMinusButton, { context: $('div') }), document.getElementById('QTYInputBox'));
    }, 1000);
});