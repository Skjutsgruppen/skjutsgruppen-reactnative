import { PureComponent } from 'react';
import { Platform } from 'react-native';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { withStoreAppToken } from '@services/apollo/profile';

class PushNotification extends PureComponent {
  componentDidMount() {
    const { storeAppToken } = this.props;
    FCM.removeAllDeliveredNotifications();
    FCM.requestPermissions();
    FCM.getFCMToken().then(token => storeAppToken(token).catch(err => console.warn(err)));

    this.notificationListner = FCM.on(FCMEvent.Notification, (notif) => {
      if (notif.local_notification || notif.opened_from_tray) {
        return;
      }

      const { _notificationType } = notif;

      if (Platform.OS === 'ios') {
        switch (_notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
          default:
            break;
        }
      }

      this.showLocalNotification(notif.fcm);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      storeAppToken(token).catch(err => console.warn(err));
    });
  }

  componentWillUnmount() {
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
  }

  showLocalNotification = (notif) => {
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: 'high',
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true,
      sound: notif.sound || 'default',
    });
  }

  render() {
    return null;
  }
}

PushNotification.propTypes = {
  storeAppToken: PropTypes.func.isRequired,
};

export default compose(withStoreAppToken)(PushNotification);
