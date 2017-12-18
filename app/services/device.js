import DeviceInfo from 'react-native-device-info';

export const getLocale = () => DeviceInfo.getDeviceLocale();
export const getCountry = () => DeviceInfo.getDeviceCountry();
export const getTimezone = () => DeviceInfo.getTimezone();
export const getPhoneNumber = () => DeviceInfo.getPhoneNumber();
