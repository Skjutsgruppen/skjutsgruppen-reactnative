import Config from 'react-native-config';
import Moment from 'moment';
import { getTimezone } from '@helpers/device';

const API_URL = Config.API_URL;
const GOOGLE_MAP_API_KEY = Config.GOOGLE_MAP_API_KEY;
const WS_API_URL = Config.WS_API_URL;
const SMS_NUMBER = Config.SMS_NUMBER;

const getDate = date => Moment.utc(date).tz(getTimezone());

const getGooglePlaceByLatlng = (latitude, longitude) => `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}&ressult_type=locality|administrative_area_level_3`;

export { getDate, API_URL, GOOGLE_MAP_API_KEY, WS_API_URL, getGooglePlaceByLatlng, SMS_NUMBER };
