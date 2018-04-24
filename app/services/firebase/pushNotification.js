import React, { Component } from 'react';
import { Platform } from 'react-native';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import ScheduledNotification from '@services/firebase/scheduleNotification';
import Scheduler from '@services/firebase/scheduler';

class PushNotification extends Component {
  async componentDidMount() {
    const { storeAppToken, user } = this.props;

    try {
      await FCM.requestPermissions({ badge: false, sound: true, alert: true });
    } catch (e) {
      console.warn(e);
    }

    FCM.removeAllDeliveredNotifications();

    if (user && user.id) {
      await FCM.getFCMToken()
        .then(appToken => storeAppToken(appToken, getDeviceId()));
    }

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

      if (notif.fcm) {
        this.showLocalNotification(notif);
      }

      if (notif.custom_notification) {
        this.scheduleLocalNotification(notif.custom_notification);
      }
    });
  }

  showLocalNotification = ({ fcm: { title, body, sound }, screen, id }) => {
    FCM.presentLocalNotification({
      title,
      body,
      priority: 'high',
      click_action: `${screen}/${id}`,
      show_in_foreground: true,
      local: true,
      sound: sound || 'default',
    });
  }

  scheduleLocalNotification = (data) => {
    const payload = JSON.parse(data);
    Scheduler.schedule(payload);
  }

  render() {
    const { user } = this.props;

    if (user.id) {
      return (
        <ScheduledNotification />
      );
    }

    return null;
  }
}

PushNotification.propTypes = {
  storeAppToken: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
};

PushNotification.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withStoreAppToken, connect(mapStateToProps))(PushNotification);
