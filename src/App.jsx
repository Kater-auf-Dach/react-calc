import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Calculator from './components/Calculator'

injectTapEventPlugin();

ReactDOM.render(<MuiThemeProvider>
                    <Calculator />
                </MuiThemeProvider>, 
                document.getElementById('root'))