import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';
import App from './App';
import { setHass } from './Hass';
import { DialogsProvider } from '@toolpad/core';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

export default () =>
    class extends HTMLElement {
        _root: ReactDOM.Root;

        constructor() {
            super();
            this._root = ReactDOM.createRoot(this);
            const props: any = {
                hass: {
                    set(value: any) {
                        setHass(value);
                    },
                },
                route: {
                    set(value: any) {
                    },
                },
                narrow: {
                    set(value: any) {
                    },
                },
                panel: {
                    set(value: any) {
                    },
                },
            };

            Object.defineProperties(this, props);
            this._render();
        }

        disconnectedCallback() {
            console.log('disconnected');
            this._root.unmount();
        }

        _render() {
            this._root.render(
                <React.StrictMode>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider  dateAdapter={AdapterDateFns}>
                            <DialogsProvider>
                                <CssBaseline />
                                <App />
                            </DialogsProvider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </React.StrictMode>,
            );
        }
    };
