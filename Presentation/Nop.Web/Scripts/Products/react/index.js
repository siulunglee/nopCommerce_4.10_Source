import React from 'react';
import { render } from 'react-dom';
import { Component } from 'react';


function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

function App() {
    return (
        <div>
            <Welcome name="Sara" />
            <Welcome name="Cahal" />
            <Welcome name="Edite" />
        </div>
    );
}

function subTotal() {
    var qty = 0;
    console.log(qty);
    //console.log(this.refs.EnteredQuantity);
    console.log("hello world");
    return qty;
}

const element = (
    <div>
        SubTotal(s): <div>{subTotal()}</div>
    </div > 
);

ReactDOM.render(element, document.getElementById('subTotal'));
