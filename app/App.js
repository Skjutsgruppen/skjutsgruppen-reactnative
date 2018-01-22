/* global __DEV__ */

import React from 'react';
import { View } from 'react-native';
import configureStore from '@redux/store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import Internet from '@components/connection/internet';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

if (__DEV__) {
  Reactotron
    .configure()
    .use(reactotronRedux())
    .connect();
}

const initialState = {};
const store = configureStore(initialState, Reactotron.createStore);

const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <View style={{ flex: 1 }}>
      <Internet />
      <Router />
    </View>
  </ApolloProvider>
);


export default App;
