import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import ScheduledNotification from '@services/firebase/scheduleNotification';
import Scheduler from '@services/firebase/scheduler';
import firebase from 'react-native-firebase';
import { Platform } from 'react-native';

class PushNotification extends Component {
  async componentDidMount() {
    const { storeAppToken, user } = this.props;
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.warn(error);
    }

    if (user && user.id) {
      this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => {
        storeAppToken(fcmToken, getDeviceId());
      });
      firebase.messaging().getToken().then(appToken => storeAppToken(appToken, getDeviceId()));
    }

    const channel = new firebase.notifications.Android.Channel(
      'skjuts-channel', 'Skjutsgruppen Channel', firebase.notifications.Android.Importance.Max,
    )
      .setDescription('Skjutsgruppen app channel');

    firebase.notifications().removeAllDeliveredNotifications();
    firebase.notifications().android.createChannel(channel);

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      this.showLocalNotification(notification);
    });

    this.messageListener = firebase.messaging().onMessage((message) => {
      const { _data: { custom_notification: customNotification } } = message;
      this.scheduleLocalNotification(customNotification);
    });
  }

  componentWillUnmount() {
    this.messageListener();
    this.notificationListener();
  }

  showLocalNotification = (message) => {
    const { _body, _title, _data: { screen, id } } = message;

    const notification = new firebase.notifications.Notification()
      .setNotificationId(new Date().valueOf().toString())
      .setTitle(_title)
      .setBody(_body)
      .setSound('default')
      .setData({ screen, id });

    if (Platform.OS === 'android') {
      notification.android.setChannelId('skjuts-channel');
      notification.android.setAutoCancel(true);
      notification.android.setPriority(firebase.notifications.Android.Priority.High);
      notification.android.setVibrate([300]);
    }

    firebase.notifications().displayNotification(notification)
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
