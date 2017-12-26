/* global __DEV__ */

import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '@redux/reducers/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const congifureStore = (initialState = {}) => {
  const middlewares = [thunk];

  if (__DEV__) {
    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(reducers, initialState, composeWithDevTools(...enhancers));

  return store;
};

export default congifureStore;
