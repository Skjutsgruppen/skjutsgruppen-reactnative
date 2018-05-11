import { Platform, NativeModules } from 'react-native';

const resolvePlanId = (planId) =>{
  switch(planId) {
    case 1:
    return 54;
    case 2:
    return 29;
    case 3:
    return 588;
    case 4:
    return 1788;
    case 5:
    return 7188;
    default:
    return 54;
  }
}

export function showPayment({generateClientToken, planId}, callback) {
  NativeModules.BraintreePayment.setToken(generateClientToken);
  NativeModules.BraintreePayment.setAmount(resolvePlanId(planId).toString());

  if (Platform.OS === 'ios') {
    NativeModules.BraintreePayment.showPayment(callback);
  } else {
    NativeModules.BraintreePayment.showPayment((paymentMethodNonce) => {
      callback(null, paymentMethodNonce);
    }, callback);
  }
}
