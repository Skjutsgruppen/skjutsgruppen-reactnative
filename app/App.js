import React from 'react';
import { View } from 'react-native';
import configureStore from '@redux/store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import Internet from '@components/connection/internet';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppLoading from '@components/appLoading';
import PushNotification from '@services/firebase/pushNotification';

const initialState = {};
const { persistor, store } = configureStore(initialState);


const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <PersistGate
      loading={<AppLoading />}
      persistor={persistor}
    >
      <View style={{ flex: 1 }}>
        <PushNotification />
        <Internet />
        <Router />
      </View>
    </PersistGate>
  </ApolloProvider>
);


export default App;
