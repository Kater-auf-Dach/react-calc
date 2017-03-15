import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import InputField from '../components/InputField';
import History from '../components/History';
import axios from 'axios';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import styles from '../app.styl';

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputedValue: '0',
            isNumberNegative: false,
            isCalculated: false,
            isNeedOperand: false,
            memory: [],
            showHistory: false,
            shouldRender: false
        }
        this.handleOperator = this.handleOperator.bind(this);
        this.handleDot = this.handleDot.bind(this);
        this.handlePercent = this.handlePercent.bind(this);
        this.toggleSign = this.toggleSign.bind(this);
        this.toggleMemoryView = this.toggleMemoryView.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.clearLast = this.clearLast.bind(this);
        this.addMemoryItem = this.addMemoryItem.bind(this);
        this.deleteMemoryItem = this.deleteMemoryItem.bind(this);

        this.serverApiUrl = 'https://calcmemoryapi.herokuapp.com';

    }

    componentDidMount() {
        axios.get(`${this.serverApiUrl}/api/memory/latest`)
             .then(res => res.data)
             .then(memory => this.setState({ 
                 memory: memory,
                 shouldRender: true
                }))
             .catch(error => this.handleError(error))
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
        const { inputedValue, isNeedOperand, id } = this.state;

        if (operator === '=') {
            let computedResult = parseFloat(eval(inputedValue).toFixed(12));
            let result = '';

            if (isFinite(computedResult)) {
              result = computedResult
            } else {
                switch (computedResult) {
                    case Infinity:
                        result = '∞'
                        break;
                    case -Infinity:
                        result = '-∞'
                        break;
                    default:
                        result = 'Error'
                        break;
                }
            }

            this.setState({
                inputedValue: result,
                isCalculated: true,
                isNeedOperand: false
            })
            this.addMemoryItem(inputedValue + '=' + eval(inputedValue))
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

        if (!(/\./).test(inputedValue)) {
            this.setState({
                inputedValue: inputedValue + '.'
            })
        }
    }

    handlePercent() {
        this.setState({
            inputedValue: String(parseFloat(this.state.inputedValue) / 100),
            isCalculated: true
        })
    }

    toggleSign() {
        const { inputedValue, isNumberNegative, isNeedOperand } = this.state;

        if (isNeedOperand) {
            let valueLength     = inputedValue.length,
                signlessString  = inputedValue.slice(0, -1),
                operator        = inputedValue.charAt(inputedValue.length - 1),
                newValue        = (signlessString * -1) + operator;
    
            this.setState({
                inputedValue: newValue,
                isNumberNegative: false
            })
        } else if (isNumberNegative || inputedValue === '0') {
            this.setState({
                inputedValue: String(inputedValue * -1),
                isNumberNegative: false
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

    addMemoryItem(item) {
        let a = new Date().toLocaleString('ru').split(',');
        let b = a[0].split('.');
        let formattedDate = `${b[2]}-${b[1]}-${b[0]} ${a[1]}`;

        let memoryItem = {
            _id: new Date(),
            date: formattedDate,
            operation: item
        }

        let memory = [...this.state.memory, memoryItem];
        this.setState({ 
            memory: memory, 
            shouldRender: true 
        })

        axios.post(`${this.serverApiUrl}/api/memory`, memoryItem)
             .then(res => console.log(res))
             .catch(error => this.handleError(error))
    }


    deleteMemoryItem(id) {
        let memory = this.state.memory.filter(memoryItem => memoryItem._id !== id );
        this.setState({ memory })

        axios.post(`${this.serverApiUrl}/api/memory/${id}`)
            .then(res => console.log(res))
            .catch(error => this.handleError(error))
    }

    toggleMemoryView() {
        const {showHistory } = this.state;
        this.setState({ showHistory: !showHistory });
    }

    handleError(error) {
        console.log(error);
    }


    render() {
        return (
            <main>
                <Paper className={styles.calculator} zDepth={4}>
                    <InputField style={styles.display} display={this.state.inputedValue} />

                    <div>
                        <div className={styles.functions}>
                            {this.state.isCalculated ?
                                <FlatButton secondary={true} className={styles.button} onClick={this.clearAll}>AC</FlatButton>
                                :
                                <FlatButton secondary={true} className={styles.button} onClick={this.clearLast}>CE</FlatButton>
                            }
                            <FlatButton secondary={true} className={styles.button} onClick={this.toggleSign}>±</FlatButton>
                            <FlatButton secondary={true} className={styles.button} onClick={this.handlePercent}>%</FlatButton>
                        </div>
                        <div className={styles.digits}>
                            <FlatButton primary={true} className={styles.button} onClick={() => this.handleDigit(0)}>0</FlatButton>
                            <FlatButton primary={true} className={styles.button} onClick={this.handleDot}>.</FlatButton>
                            <FlatButton 
                                secondary={true} 
                                className={styles.button}
                                disabled={!this.state.memory.length > 0}
                                onClick={() => this.toggleMemoryView()}>
                                    ME
                            </FlatButton>
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
                </Paper>

                {this.state.shouldRender && this.state.showHistory? 
                    <History memories={this.state.memory} onDelete={this.deleteMemoryItem} /> 
                    : 
                    null
                }

            </main>
        )
    }

}

export default Calculator;