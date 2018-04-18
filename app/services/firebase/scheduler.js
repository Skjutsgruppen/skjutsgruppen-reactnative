import FCM from 'react-native-fcm';
import { getDate } from '@config';
import { SHARE_LOCATION_MINUTE, SHARE_EXPERIENCE_DEFAULT_MINUTE } from '@config/constant';

class Scheduler {
  getTimeForLocationSharing = date => new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime() - (SHARE_LOCATION_MINUTE * 60000);

  getTimeForExperienceSharing = (duration, date) => {
    if (duration > 0) {
      return new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime() + ((duration * 1000) / 2);
    }

    return new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime() + (SHARE_EXPERIENCE_DEFAULT_MINUTE * 60000);
  };

  schedule = (payload) => {
    const date = getDate(payload.date);
    const locationSharingTime = this.getTimeForLocationSharing(date);
    const experienceSharingTime = this.getTimeForExperienceSharing(payload.duration, date);
    let locationBody = '';

    if (payload.flexibilityInfo && payload.flexibilityInfo.duration > 0) {
      locationBody = 'Is your ride about to start? Would you like to share your location?';
    } else {
      locationBody = 'Your ride is about to start. Would you like to share your location?';
    }

    const experienceBody = 'Enjoying the ride? Make an experience.';

    this.scheduleNotification(`${payload.id}-location`, locationSharingTime, payload.title, locationBody, payload.id);
    this.scheduleNotification(`${payload.id}-experience`, experienceSharingTime, payload.title, experienceBody, payload.id);
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
      picture: '',
      wake_screen: true,
      extra1: { a: 1 },
      sound: 'default',
      tripId,
      screen: 'TripDetail',
    });
  }

  getScheduledNotifications = () => FCM.getScheduledLocalNotifications()

  removeScheduledNotifications = () => FCM.cancelAllLocalNotifications();
}

export default new Scheduler();

