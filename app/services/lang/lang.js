import Session from '@services/storage/session';

class Lang {
  constructor() {
    this.session = Session;
    this.langKey = 'lang';
  }

  setLanguage(lang = 'en') {
    return this.session.set(this.langKey, lang);
  }

  getLanguage() {
    return this.session.get(this.langKey);
  }
}

export default new Lang();
