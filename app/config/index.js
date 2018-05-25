import Config from 'react-native-config';
import Moment from 'moment';
import { getTimezone } from '@helpers/device';

const API_URL = Config.API_URL;
const GOOGLE_MAP_API_KEY = Config.GOOGLE_MAP_API_KEY;
const WS_API_URL = Config.WS_API_URL;
const SMS_NUMBER = Config.SMS_NUMBER;
const APP_URL = `https://${Config.APP_URL}`;

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
