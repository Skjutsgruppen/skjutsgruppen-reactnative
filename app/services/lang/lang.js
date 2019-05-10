import Session from '@services/storage/session';
import DeviceInfo from 'react-native-device-info';
import Moment from 'react-moment';

class Lang {
  constructor() {
    this.session = Session;
    this.langKey = 'lang';

    this.locale = DeviceInfo.getDeviceLocale().split('-')[0];
  }

  setLanguage(lang = 'en') {
    return this.session.set(this.langKey, lang);
  }

  async getLanguage() {
    const currentLang = await this.session.get(this.langKey);

    if (currentLang && currentLang !== '') return currentLang;

    this.setLanguage(this.locale);

    return this.locale;
  }
}

export default new Lang();
