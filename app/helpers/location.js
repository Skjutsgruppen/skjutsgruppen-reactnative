import { GOOGLE_MAP_API_KEY } from '@config';

export const getPlaceByLatlngURL = (latitude, longitude) => `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}&ressult_type=locality|administrative_area_level_3`;

export const getPlaceSuggestURL = (text, language = 'en', type = '') => `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(text)}&key=${GOOGLE_MAP_API_KEY}&language=${language}&types=${type}`;

export const getPlaceDetailURL = (placeId, language = 'en') => `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAP_API_KEY}&placeid=${placeId}&language=${language}`;
