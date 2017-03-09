import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import InputField from '../components/InputField';
import FlatButton from 'material-ui/FlatButton';

import styles from '../app.styl';

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputedValue: '0',
            isNumberNegative: false,
            isCalculated: false,
            isNeedOperand: false,
            memory: []
        }

        this.handleOperator = this.handleOperator.bind(this);
        this.handleDot = this.handleDot.bind(this);
        this.handlePercent = this.handlePercent.bind(this);
        this.handleNegativeNumber = this.handleNegativeNumber.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.clearLast = this.clearLast.bind(this);
        this.addToMemory = this.addToMemory.bind(this);
    }

    componentWillMount() {
        axios.get('')
            .then(response => response.data)
            .then(memory => this.setState({ memory }))
            .catch(error => console.log(error))
    }

    handleDigit(digit) {
        const { inputedValue } = this.state;

        this.setState({
            inputedValue: inputedValue === '0' ? String(digit) : inputedValue + digit,
            isCalculated: false,
            isNeedOperand: false
        })
    }

    handleOperator(operator) {
        const { inputedValue, isNeedOperand } = this.state;

        if (operator === '=') {
            this.setState({
                inputedValue: String(eval(inputedValue)),
                isCalculated: true,
                isNeedOperand: false
            })
            this.addToMemory(inputedValue + '=' + eval(inputedValue))
        } else {
            if (isNeedOperand) {
                this.setState({
                    inputedValue: inputedValue.slice(0, -1) + operator,
                    isCalculated: false,
                    isNeedOperand: true
                })
            } else {
                this.setState({
                    inputedValue: inputedValue + operator,
                    isCalculated: false,
                    isNeedOperand: true
                })
            }
        }
    }

    handleDot() {
        const { inputedValue } = this.state;

        if (!(/\.,/).test(inputedValue)) {
            this.setState({
                inputedValue: inputedValue + '.'
            })
        }
    }

    handlePercent() {
        this.setState({
            inputedValue: String(parseFloat(this.state.inputedValue) / 100)
        })
    }

    handleNegativeNumber() {
        const { inputedValue, isNumberNegative } = this.state;

        if (isNumberNegative || parseFloat(inputedValue) < 0) {
            this.setState({
                inputedValue: String(inputedValue * -1),
                isNumberNegative: false,
            })
        } else {
            this.setState({
                inputedValue: '-' + inputedValue,
                isNumberNegative: true
            })
        }
    }

    clearAll() {
        this.setState({
            inputedValue: '0',
            isCalculated: false
        })
    }

    clearLast() {
        const { inputedValue } = this.state;

        if (inputedValue.length !== 1) {
            this.setState({
                inputedValue: inputedValue.slice(0, -1)
            })
        } else {
            this.setState({
                inputedValue: '0'
            })
        }
    }

    addToMemory(item) {
        const { memory } = this.state;
        console.log(this.nextId)

        let a = new Date().toLocaleString('ru').split(',');
        let b = a[0].split('.');
        let formattedDate = `${b[2]}-${b[1]}-${b[0]} ${a[1]}`;

        let memoryItem = {
            //id: this.nextId++,
            date: formattedDate,
            operation: item
        }
        memory.push(memoryItem);

        this.setState({ memory })
        console.log(memory)
    }


    render() {

        return (
            <main className={styles.calculator}>
                <InputField style={styles.display} display={this.state.inputedValue} />

                <div>
                    <div className={styles.functions}>
                        {this.state.inputedValue === '0' || this.state.isCalculated ?
                            <FlatButton secondary={true} className={styles.button} onClick={this.clearAll}>AC</FlatButton>
                            :
                            <FlatButton secondary={true} className={styles.button} onClick={this.clearLast}>C</FlatButton>
                        }
                        <FlatButton secondary={true} className={styles.button} onClick={this.handleNegativeNumber}>±</FlatButton>
                        <FlatButton secondary={true} className={styles.button} onClick={this.handlePercent}>%</FlatButton>
                    </div>
                    <div className={styles.digits}>
                        <FlatButton primary={true} style={{width: '160px', height: '80px' }} onClick={() => this.handleDigit(0)}>0</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={this.handleDot}>.</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(1)}>1</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(2)}>2</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(3)}>3</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(4)}>4</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(5)}>5</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(6)}>6</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(7)}>7</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(8)}>8</FlatButton>
                        <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(9)}>9</FlatButton>
                    </div>
                </div>

                <div className={styles.operators}>
                    <FlatButton secondary={true} className={styles.button} onClick={() => this.handleOperator('/')}>÷</FlatButton>
                    <FlatButton secondary={true} className={styles.button} onClick={() => this.handleOperator('*')}>×</FlatButton>
                    <FlatButton secondary={true} className={styles.button} onClick={() => this.handleOperator('-')}>-</FlatButton>
                    <FlatButton secondary={true} className={styles.button} onClick={() => this.handleOperator('+')}>+</FlatButton>
                    <FlatButton secondary={true} className={styles.button} onClick={() => this.handleOperator('=')}>=</FlatButton>
                </div>
            </main>
        )
    }

}

export default Calculator;