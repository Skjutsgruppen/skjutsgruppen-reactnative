/* @flow */

import React from 'react';
import configureStore from '@redux/store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import { Provider } from 'react-redux';

const initialState = {};
const store = configureStore(initialState);

const App = () => (
  <ApolloProvider client={Apollo}>
    <Provider store={store}>
      <Router />
    </Provider>
  </ApolloProvider>
);

export default App;
