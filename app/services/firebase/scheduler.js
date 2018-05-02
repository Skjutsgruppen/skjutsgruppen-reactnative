import FCM from 'react-native-fcm';
import { getDate } from '@config';
import { SHARE_LOCATION_MINUTE, SHARE_EXPERIENCE_DEFAULT_MINUTE } from '@config/constant';
import { trans } from '@lang/i18n';

class Scheduler {
  getMillisecond = date => new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime();

  currentDateTime = () => getDate(new Date());

  getTimeForLocationSharing = date => this.getMillisecond(date) - (SHARE_LOCATION_MINUTE * 60000);

  getTimeForExperienceSharing = (duration, date) => {
    if (duration > 0) {
      return this.getMillisecond(date) + ((duration * 1000) / 2);
    }

    return this.getMillisecond(date) + (SHARE_EXPERIENCE_DEFAULT_MINUTE * 60000);
  }

  shouldScheduleLocationSharing = date =>
    this.getMillisecond(this.currentDateTime()) <= this.getTimeForLocationSharing(date);

  shouldScheduleExperienceSharing = (duration, date) =>
    this.getMillisecond(this.currentDateTime()) <= this.getTimeForExperienceSharing(duration, date);


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

  scheduleNotification = (id, fireDate, title, body, tripId) => {
    FCM.scheduleLocalNotification({
      id: id.toString(),
      fire_date: fireDate,
      vibrate: 500,
      title,
      body,
      sub_text: 'Ride',
      priority: 'high',
      large_icon: '',
      show_in_foreground: true,
      wake_screen: true,
      sound: 'default',
      tripId,
      screen: 'TripDetail',
    });
  }

  getScheduledNotifications = () => FCM.getScheduledLocalNotifications()

  removeScheduledNotifications = () => FCM.cancelAllLocalNotifications();

  removeSpecificScheduledNotification = async (id) => {
    await FCM.cancelLocalNotification(`${id}-location`);
    await FCM.cancelLocalNotification(`${id}-experience`);
  }

  checkAndRemoveScheduledNotification = async (id, muteTime) => {
    const notifications = await this.getScheduledNotifications();
    const targetNotifications = notifications.filter(row => row.tripId === id);

    targetNotifications.map(async (notification) => {
      if (notification.fire_date <= (new Date(muteTime).getTime())) {
        await FCM.cancelLocalNotification(`${id}-location`);
        await FCM.cancelLocalNotification(`${id}-experience`);
      }
    });
  }
}

export default new Scheduler();

