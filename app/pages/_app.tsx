import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import axios from 'axios';
import createStore from '@/store';
import { axiosInterceptorsConfig } from '@/utils/axios-interceptors-config';

const isServer = typeof window === 'undefined';

//@ts-ignore
if (!global.window) global.window = global;

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
    console.info('props.pageProps', props.pageProps);
    this.store = getOrCreateStore(data);
    window.$getState = this.store.getState;
    window.$dispatch = this.store.dispatch;
  }

  store: any;

  componentDidMount() {
    window.axios = axios;
    axiosInterceptorsConfig(axios);
  }

  componentDidCatch(e, info) {
    // log error on console with info and error
    console.error('_app.js componentDidCatch e', e, 'info', info);
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
