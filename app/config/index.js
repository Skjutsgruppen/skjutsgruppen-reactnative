import Config from 'react-native-config';
import Moment from 'moment';
import { getTimezone } from '@helpers/device';

const {
  API_URL, GOOGLE_MAP_API_KEY, WS_API_URL, SMS_NUMBER,
} = Config;
const APP_URL = `http://${Config.APP_URL}`;

const getDate = date => Moment.utc(date).tz(getTimezone());

const UcFirst = str => (str ? (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()) : '');

export {
  getDate,
  API_URL,
  GOOGLE_MAP_API_KEY,
  WS_API_URL,
  SMS_NUMBER,
  UcFirst,
  APP_URL,
};
