import React, { Component } from 'react';

const InputField = props => <input type="text" className={props.style} value={props.display} readOnly></input>

export default InputField;