import Config from 'react-native-config';

const API_URL = Config.API_URL;
const GOOGLE_PLACE_KEY = Config.GOOGLE_PLACE_KEY;
const WS_API_URL = Config.WS_API_URL;

const getGooglePlaceByLatlng = (latitude, longitude) => `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACE_KEY}&ressult_type=locality|administrative_area_level_3`;

export { API_URL, GOOGLE_PLACE_KEY, WS_API_URL, getGooglePlaceByLatlng };
