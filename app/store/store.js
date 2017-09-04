/* global __DEV__ */

import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '@redux/reducers/reducers';

const congifureStore = (initialState = {}) => {
  const middlewares = [thunk];

  if (__DEV__) {
    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(reducers, initialState, compose(...enhancers));

  return store;
};

export default congifureStore;
