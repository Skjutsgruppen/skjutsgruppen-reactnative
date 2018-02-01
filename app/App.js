import React from 'react';
import { View } from 'react-native';
import configureStore from '@redux/store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import Internet from '@components/connection/internet';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Loading } from '@components/common';

const initialState = {};
const { persistor, store } = configureStore(initialState);

const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <PersistGate
      loading={<Loading />}
      persistor={persistor}
    >
      <View style={{ flex: 1 }}>
        <Internet />
        <Router />
      </View>
    </PersistGate>
  </ApolloProvider>
);


export default App;
