/* global navigator */
import timezones from '@config/timezone';
import { getTimezone } from '@services/device';

export const getCountryLocation = () => {
  const found = timezones.filter(row => row.name === getTimezone());
  if (found[0]) {
    return { longitude: found[0].long, latitude: found[0].lat };
  }

  return { longitude: '', latitude: '' };
};

export const getCurrentLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      resolve({ latitude, longitude });
    },
    error => reject(error),
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  );
});
