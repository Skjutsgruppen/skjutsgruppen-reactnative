/* global navigator */
import { Platform, NativeModules, DeviceEventEmitter, Alert } from 'react-native';
import Session from '@services/storage/session';

class GeoLocation {
  constructor() {
    this.session = Session;
    this.locationServiceStartedKey = 'geoLocationServiceStarted';
    this.updateLocationEventListenerArrayKey = 'updateLocationEventListenerArray';
    this.nativeModules = NativeModules;
    this.deviceEventEmitter = DeviceEventEmitter;
  }

  showSettings = () => {
    if (Platform === 'android' || Platform.OS === 'android') {
      NativeModules.GeoLocation.showGpsSetting();
    }
  }
  isGpsEnabled = () => NativeModules.GeoLocation.checkGpsStatus();

  async startLocationService() {
    try {
      const geoLocationServiceStarted = await this.session.get(this.locationServiceStartedKey);

      if (geoLocationServiceStarted) return Promise.resolve();

      await this.session.set(this.locationServiceStartedKey, 'true');

      return NativeModules.GeoLocation.startService();
    } catch (e) {
      console.warn(e);
    }

    return Promise.resolve();
  }

  stopLocationService() {
    return NativeModules.GeoLocation.stopService().then(() => {
      this.session.remove(this.locationServiceStartedKey);
    }).catch(error => console.warn(error));
  }

  async listenToLocationUpdate(type, id, callback) {
    let coords = {};
    try {
      const updateLocationEventListenerArray =
        await this.session.get(this.updateLocationEventListenerArrayKey) || [];

      if (updateLocationEventListenerArray.length === 0) {
        if (Platform.OS === 'ios') {
          this.loadInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (geoData) => {
                if (geoData && geoData.coords && geoData.coords.latitude) {
                  if (!(coords.latitude === geoData.coords.latitude &&
                    coords.longitude === geoData.coords.longitude)) {
                    callback(geoData);
                    coords = geoData.coords;
                  }
                }
              },
              () => {
                Alert.alert('Sorry, could not track your location! Please check if your GPS is turned on.');
              },
              { timeout: 20000, maximumAge: 1000 },
            );
          }, 10000);
        }
        this.deviceEventEmitter.addListener('updateLocation', (geoData) => {
          callback(geoData);
        });
      }

      if (updateLocationEventListenerArray
        .findIndex(obj => (obj.type === type && obj.id === id)) > -1) return Promise.resolve();

      updateLocationEventListenerArray.push({ type, id });

      await this.session
        .set(this.updateLocationEventListenerArrayKey, updateLocationEventListenerArray);

      return this.startLocationService();
    } catch (e) {
      console.warn(e);
    }

    return Promise.resolve();
  }

  async stopListeningToLocationUpdate(type, id) {
    try {
      const updateLocationEventListenerArray = await this.session
        .get(this.updateLocationEventListenerArrayKey) || [];

      if (updateLocationEventListenerArray.length === 0) return Promise.resolve();

      const newUpdateLocationEventListenerArray = updateLocationEventListenerArray
        .filter(obj => !(obj.type === type && obj.id === id));

      if (newUpdateLocationEventListenerArray.length > 0) {
        await this.session
          .set(this.updateLocationEventListenerArrayKey, newUpdateLocationEventListenerArray);

        return Promise.resolve();
      }

      if (Platform.OS === 'ios') {
        if (this.loadInterval) clearInterval(this.loadInterval);
        this.loadInterval = false;
      }
      this.deviceEventEmitter.removeListener('updateLocation');
      this.session.remove(this.updateLocationEventListenerArrayKey);
      return this.stopLocationService();
    } catch (e) {
      console.warn(e);
    }

    return Promise.resolve();
  }
}

export default new GeoLocation();
