import react from 'react';
import { render } from 'react-dom';
import { component } from 'react';


//class plusMinusButton extends React.Component {
//    constructor(props) {
//        super(props);

//        this.state = {
//            context: props.context
//        };
//        this.onClick = this.onClick.bind(this);
//    }

//    //this.StyleButton = {
//    //    'padding': '4px 7px',
//    //    fontSize: '18px',
//    //};

//    onClick() {
//        // Get reference to a JQuery object in parent app.
//        var box = this.state.context.find('.qty-input');

//        // Change the color of the box.
//        //box.css('background-color', (box.css('background-color') === 'rgb(255, 0, 0)' ? 'green' : 'red'));

//        box.value = '10';
//    }
//    render() {
//        return (
//            <div>
//                <input id="plusQtyButton" type="button" className="qtyButton"  value=" + " />
//            <input id="minusQtyButton" type="button" className="qtyButton" value=" - " />



//            </div>
//        );
//    }
//}


    var styleButton = {
        'padding': '4px 7px',
        fontSize: '18px'
    };

//const QtyButton = () => (
//    <div>
//        <input id="plusQtyButton" type="button" className="qtyButton" style={styleButton} value=" + " />
//        <input id="minusQtyButton" type="button" className="qtyButton" style={styleButton} value=" - " />
//    </div>
//);

//export default QtyButton;


const plusMiusQtyButton = (
    <div>
        <input id="plusQtyButton" type="button" className="qtyButton" style={styleButton} value=" + " />
        <input id="minusQtyButton" type="button" className="qtyButton" style={styleButton} value=" - " />
        //<input asp-for="EnteredQuantity" className="qty-input" type="text" ref="EnteredQuantity" />
    </div > 
);

ReactDOM.render(plusMiusQtyButton, document.getElementById('QTYInputBox'));
