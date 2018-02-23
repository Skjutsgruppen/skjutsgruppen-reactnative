import { NativeModules, DeviceEventEmitter } from 'react-native';
import Session from '@services/storage/session';

class GeoLocation {
  constructor() {
    this.session = Session;
    this.locationServiceStartedKey = 'geoLocationServiceStarted';
    this.updateLocationEventListenerArrayKey = 'updateLocationEventListenerArray';
    this.nativeModules = NativeModules;
    this.deviceEventEmitter = DeviceEventEmitter;
  }

  async startLocationService() {
    const geoLocationServiceStarted = await this.session.get(this.locationServiceStartedKey);

    if (geoLocationServiceStarted) return;

    await this.session.set(this.locationServiceStartedKey, 'true');

    NativeModules.GeoLocation.startService();
  }

  stopLocationService() {
    NativeModules.GeoLocation.stopService().then(() => {
      this.session.remove(this.locationServiceStartedKey);
    });
  }

  async listenToLocationUpdate(type, id, callback) {
    this.startLocationService();
    const updateLocationEventListenerArray =
    await this.session.get(this.updateLocationEventListenerArrayKey) || [];
    if (updateLocationEventListenerArray.length === 0) {
      this.deviceEventEmitter.addListener('updateLocation', (geoData) => {
        callback(geoData);
      });
    }

    if (updateLocationEventListenerArray
      .findIndex(obj => (obj.type === type && obj.id === id)) > -1) return;

    updateLocationEventListenerArray.push({ type, id });

    await this.session
      .set(this.updateLocationEventListenerArrayKey, updateLocationEventListenerArray);
  }

  async stopListeningToLocationUpdate(type, id) {
    const updateLocationEventListenerArray = await this.session
      .get(this.updateLocationEventListenerArrayKey) || [];

    if (updateLocationEventListenerArray.length === 0) return;

    const newUpdateLocationEventListenerArray = updateLocationEventListenerArray
      .filter(obj => !(obj.type === type && obj.id === id));

    if (newUpdateLocationEventListenerArray.length > 0) {
      await this.session
        .set(this.updateLocationEventListenerArrayKey, newUpdateLocationEventListenerArray);

      return;
    }

    this.deviceEventEmitter.removeListener('updateLocation');
    this.session.remove(this.updateLocationEventListenerArrayKey);
    this.stopLocationService();
  }
}

export default new GeoLocation();
