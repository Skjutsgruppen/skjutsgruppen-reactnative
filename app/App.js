import React from 'react';
import configureStore from '@redux/store';
import Router from '@routes';
import { ApolloProvider } from 'react-apollo';
import Apollo from '@services/apollo';
import Internet from '@components/connection/internet';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppLoading from '@components/appLoading';
import PushNotification from '@services/firebase/pushNotification';
import KeyboradView from '@components/utils/keyboardView';

const initialState = {};
const { persistor, store } = configureStore(initialState);


const App = () => (
  <ApolloProvider store={store} client={Apollo}>
    <PersistGate
      loading={<AppLoading />}
      persistor={persistor}
    >
      <KeyboradView style={{ flex: 1 }} behavior="padding">
        <PushNotification />
        <Internet />
        <Router />
      </KeyboradView>
    </PersistGate>
  </ApolloProvider>
);


export default App;
