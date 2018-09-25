import * as RNIap from 'react-native-iap';
import {
  Platform,
  Linking,
} from 'react-native';

export async function showPayment(planId, callback) {
  try {
    await RNIap.prepare();
    await RNIap.getSubscriptions([planId]);
    const purchase = await RNIap.buySubscription(planId);
    callback(null, purchase);
  } catch (err) {
    callback(err, null);
  } finally {
    await RNIap.endConnection();
  }
}

export function unsubscribePayment(planId) {
  if (Platform.OS === 'ios') {
    Linking.openURL('https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions');
  } else {
    Linking.openURL(`https://play.google.com/store/account/subscriptions?sku=${planId}&package=nu.skjutsgruppen.skjutsgruppen`);
  }
}
