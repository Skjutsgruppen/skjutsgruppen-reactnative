/* global __DEV__ */

import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '@redux/reducers/reducers';
import Apollo from '@services/apollo';
import ScreenTracker from '@redux/screenTracker';

const congifureStore = (initialState = {}, customStore) => {
  const middlewares = [thunk];

  if (__DEV__) {
    middlewares.push(logger);
  }

  middlewares.push(Apollo.middleware());
  middlewares.push(ScreenTracker);

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const makeStore = (__DEV__ && typeof customStore === 'function') ? customStore : createStore;

  const store = makeStore(reducers, initialState, compose(...enhancers));

  return store;
};

export default congifureStore;
