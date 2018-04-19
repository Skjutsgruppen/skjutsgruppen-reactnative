
import I18n from 'react-native-i18n';
import LangService from '@services/lang';

import {
  global as globalEn,
  feed as feedEn,
  profile as profileEn,
  group as groupEn,
  search as searchEn,
  add as addEn,
  message as messageEn,
  trip as tripEn,
  addGroup as addGroupEn,
  setting as settingEn,
  about as aboutEn,
  interval as intervalEn,
} from '@lang/locales/en';
import {
  global as globalSe,
  feed as feedSe,
  profile as profileSe,
  group as groupSe,
  search as searchSe,
  add as addSe,
  message as messageSe,
  trip as tripSe,
  addGroup as addGroupSe,
  setting as settingSe,
  about as aboutSe,
  interval as intervalSe,
} from '@lang/locales/se';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    feed: feedEn,
    add: addEn,
    global: globalEn,
    profile: profileEn,
    group: groupEn,
    search: searchEn,
    message: messageEn,
    trip: tripEn,
    addGroup: addGroupEn,
    setting: settingEn,
    about: aboutEn,
    interval: intervalEn,
  },
  se: {
    feed: feedSe,
    add: addSe,
    global: globalSe,
    profile: profileSe,
    group: groupSe,
    search: searchSe,
    message: messageSe,
    trip: tripSe,
    addGroup: addGroupSe,
    setting: settingSe,
    about: aboutSe,
    interval: intervalSe,
  },
};

async function loadLocal() {
  const lang = await LangService.getLanguage();
  if (lang) {
    I18n.locale = lang;
  }
}

loadLocal();

export function trans(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
