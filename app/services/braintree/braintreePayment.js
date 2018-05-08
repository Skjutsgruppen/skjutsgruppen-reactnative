import { Platform, NativeModules } from 'react-native';

export function showPayment(generateClientToken, callback) {
  NativeModules.BraintreePayment.setToken(generateClientToken);

  if (Platform.OS === 'ios') {
    NativeModules.BraintreePayment.showPayment(callback);
  } else {
    NativeModules.BraintreePayment.showPayment((paymentMethodNonce) => {
      callback(null, paymentMethodNonce);
    }, callback);
  }
}
