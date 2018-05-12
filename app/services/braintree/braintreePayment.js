import { NativeModules } from 'react-native';

export function showPayment(generateClientToken, callback) {
  NativeModules.BraintreePayment.setToken(generateClientToken);
  NativeModules.BraintreePayment.showPayment(callback);
}
