import React, { Component } from 'react';

function InputField(props) {

    let value = props.display;

    // const lang = navigator.language || 'ru';
    // value = parseFloat(value).toLocaleString(lang, {
    //     useGrouping: true,
    //     maximumFractionDigits: 6
    // })

    return (
        <input type="text" className={props.style} value={value} readOnly></input>
    );
}

export default InputField;