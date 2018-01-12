/* @flow */

import React from 'react';
import { View } from 'react-native';
import configureStore from '@store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import Internet from '@components/connection/internet';

const initialState = {};
const store = configureStore(initialState);

const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <View style={{ flex: 1 }}>
      <Internet />
      <Router />
    </View>
  </ApolloProvider>
);


export default App;
