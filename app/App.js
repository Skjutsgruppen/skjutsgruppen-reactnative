/* @flow */

import React from 'react';
import configureStore from '@store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';

const initialState = {};
const store = configureStore(initialState);

const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <Router />
  </ApolloProvider>
);


export default App;
