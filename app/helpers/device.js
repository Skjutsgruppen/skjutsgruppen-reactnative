/* global navigator */
import timezones from '@config/timezone';
import countries from '@config/countries';
import DeviceInfo from 'react-native-device-info';
import { DEFAULT_COUNTRY_CODE } from '@config/constant';

export const getLocale = () => DeviceInfo.getDeviceLocale();
export const getCountry = () => DeviceInfo.getDeviceCountry();
export const getTimezone = () => DeviceInfo.getTimezone();
export const getPhoneNumber = () => DeviceInfo.getPhoneNumber();

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

export const getCountryDialCode = () => {
  const found = timezones.filter(row => row.name === getTimezone());
  let code = DEFAULT_COUNTRY_CODE;

  if (found[0]) {
    code = found[0].countries[0];
  }
  let dialCode = '';
  countries.forEach((row) => {
    if (row.code === code) {
      dialCode = row.dialCode;
    }
  });

  return dialCode;
};

export const getDeviceId = () => DeviceInfo.getDeviceId();
