/* eslint-disable react/jsx-filename-extension */
import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import _ from 'lodash';
import createStore from '../store';

const isServer = typeof window === 'undefined';
if (isServer) {
    // not print in back end, such as in vscode
    console.log = () => {};
}

if (!global.window) global.window = global;
// put helpful tools here
window._ = _;

const REDUX_STORE = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) {
        return createStore(initialState);
    }
    // Create store if unavailable on the client and set it on the window object
    if (!window[REDUX_STORE]) {
        window[REDUX_STORE] = createStore(initialState);
    }
    return window[REDUX_STORE];
}

class MyApp extends App {

    static async getInitialProps(appContext) {
        const appProps = await App.getInitialProps(appContext);
        return { ...appProps };
    }

    constructor(props) {
        super(props);
        const { data = {} } = props.pageProps;
        this.store = getOrCreateStore({
            data
				})
				window.$getState = this.store.getState
				window.$dispatch = this.store.dispatch
    }

    componentDidCatch(e, info) {
        // log error on console with info and error
        console.error("_app.js componentDidCatch e", e, 'info', info);
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Provider store={this.store}>
                {/* {pageProps.data && !pageProps.data.notShowHeaderAndFooter && <Header {...pageProps.data} />} */}
                <Component {...pageProps} />
                {/* {pageProps.data && !pageProps.data.notShowHeaderAndFooter && <Footer />} */}
            </Provider>
        );
    }
}

export default MyApp;
