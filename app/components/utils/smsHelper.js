import { Linking, Platform } from 'react-native';
import SendSMS from 'react-native-sms';

export default (body, numbers) => {
  if (Platform.OS === 'android') {
    const sendList = numbers.join(';');
    Linking.openURL(`sms:${sendList};?body=${body}`);
  } else {
    setTimeout(() => {
      SendSMS.send({
        body,
        recipients: numbers,
        successTypes: ['sent', 'queued'],
      }, () => { });
    }, 1000);
  }
};

