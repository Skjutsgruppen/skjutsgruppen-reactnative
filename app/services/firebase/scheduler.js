import firebase from 'react-native-firebase';
import { getDate } from '@config';
import { SHARE_LOCATION_MINUTE, SHARE_EXPERIENCE_DEFAULT_MINUTE } from '@config/constant';
import { trans } from '@lang/i18n';
import { Platform } from 'react-native';
import moment from 'moment';

class Scheduler {
  currentDateTime = () => getDate(moment());

  getTimeForLocationSharing = date => getDate(date).subtract(SHARE_LOCATION_MINUTE, 'minute').valueOf();

  getTimeForExperienceSharing = (duration, date) => {
    if (duration > 0) {
      return getDate(date).add((duration / 2), 'second').valueOf();
    }

    return getDate(date).add(SHARE_EXPERIENCE_DEFAULT_MINUTE, 'minute').valueOf();
  }

  shouldScheduleLocationSharing = date =>
    this.currentDateTime().valueOf() <= this.getTimeForLocationSharing(date);

  shouldScheduleExperienceSharing = (duration, date) =>
    this.currentDateTime().valueOf() <= this.getTimeForExperienceSharing(duration, date);


  schedule = (payload) => {
    const date = getDate(payload.date);

    if (this.shouldScheduleLocationSharing(date)) {
      const locationSharingTime = this.getTimeForLocationSharing(date);
      let locationBody = '';

      if (payload.flexibilityInfo && payload.flexibilityInfo.duration > 0) {
        locationBody = trans('global.is_your_ride_about_to_start');
      } else {
        locationBody = trans('global.your_ride_is_about_to_start');
      }

      this.scheduleNotification(`${payload.id}-location`, locationSharingTime, payload.title, locationBody, payload.id);
    }

    if (this.shouldScheduleExperienceSharing(payload.duration, date)) {
      const experienceBody = trans('global.enjoying_your_ride_make_experience');
      const experienceSharingTime = this.getTimeForExperienceSharing(payload.duration, date);

      this.scheduleNotification(`${payload.id}-experience`, experienceSharingTime, payload.title, experienceBody, payload.id);
    }
  }

  scheduleNotification = (id, date, title, body, tripId) => {
    let notification = new firebase.notifications.Notification();

    notification = notification.setNotificationId(id.toString())
      .setTitle(title)
      .setBody(body)
      .setSubtitle('Ride')
      .setSound('default')
      .setData({ screen: 'TripDetail', id: tripId });

    if (Platform.OS === 'android') {
      notification.android.setChannelId('skjuts-channel');
      notification.android.setAutoCancel(true);
      notification.android.setPriority(firebase.notifications.Android.Priority.High);
      notification.android.setVibrate([300]);
    }

    firebase.notifications().scheduleNotification(notification, {
      fireDate: date,
    });
  }

  getScheduledNotifications = () => firebase.notifications().getScheduledNotifications()

  removeScheduledNotifications = () => firebase.notifications().cancelAllNotifications();

  removeSpecificScheduledNotification = async (id) => {
    await firebase.notifications().cancelNotification(`${id} - location`);
    await firebase.notifications().cancelNotification(`${id} - experience`);
  }

  checkAndRemoveScheduledNotification = async (id, muteTime) => {
    const notifications = await this.getScheduledNotifications();
    const targetNotifications = notifications.filter(row => row.tripId === id);

    targetNotifications.map(async (notification) => {
      if (notification.fire_date <= (new Date(muteTime).getTime())) {
        await firebase.notifications().cancelNotification(`${id} - location`);
        await firebase.notifications().cancelNotification(`${id} - experience`);
      }
    });
  }
}

export default new Scheduler();

