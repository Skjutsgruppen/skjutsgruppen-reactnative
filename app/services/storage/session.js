import { AsyncStorage } from 'react-native';

class Session {
  constructor(storage) {
    this.storage = storage;
  }

  set(key, data) {
    let value = data;

    if (typeof data === 'object') {
      value = JSON.stringify(data);
    }

    return this.storage.setItem(key, value);
  }

  async get(key) {
    const value = await this.storage.getItem(key);

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  remove(key) {
    return this.storage.removeItem(key);
  }
}

export default new Session(AsyncStorage);
