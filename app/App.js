/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '@store';
import Router from '@routes';

const initialState = {};
const store = configureStore(initialState);

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

export default App;
