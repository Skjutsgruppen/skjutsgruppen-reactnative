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
import { LocaleConfig } from 'react-native-calendars';

const initialState = {};
const { persistor, store } = configureStore(initialState);

LocaleConfig.locales.sv = {
  monthNames: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  dayNames: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  dayNamesShort: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
  today: 'i dag',
};
LocaleConfig.locales.en = {
  monthNames: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthNamesShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  dayNames: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  dayNamesShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  today: 'Today',
};
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
