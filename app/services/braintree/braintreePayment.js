import { NativeModules } from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Linking,
  Alert
} from 'react-native';
import message from '../lang';

const itemSkus = Platform.select({
  ios: [
    'yearly_subscription_plan_1'
  ],
  android: [
    'monthly_subscription_1_test'
  ]
});
export async function showPayment(type, callback) {
  // NativeModules.BraintreePayment.setToken(generateClientToken);
  // NativeModules.BraintreePayment.showPayment(callback);


    console.log(type);

    if(type == 1){
      console.log("subscribing =================== ")
      try {
        await RNIap.prepare();
        const products = await RNIap.getSubscriptions(itemSkus);
        console.log(products)
        const purchase = await RNIap.buySubscription('yearly_subscription_plan_1')
        console.log(purchase)
        // Ready to call RNIap.getProducts(), etc.
      } catch(err) {
        console.warn(err); // standardized err.code and err.message available
      }
    } else{
      console.log("================ un subscribing =================== ")
      
      Linking.openURL('https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions')

    }


}
