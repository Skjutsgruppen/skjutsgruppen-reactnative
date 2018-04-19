
import I18n from 'react-native-i18n';
import LangService from '@services/lang';

import {
  feed as feedEn,
  add as addEn,
  global as globalEn,
  detail as detailEn,
  profile as profileEn,
  group as groupEn,
  search as searchEn,
  message as messageEn,
  addGroup as addGroupEn,
  setting as settingEn,
  about as aboutEn,
  interval as intervalEn,
} from '@lang/locales/en';
import {
  feed as feedSe,
  add as addSe,
  global as globalSe,
  detail as detailSe,
  profile as profileSe,
  group as groupSe,
  search as searchSe,
  message as messageSe,
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
    detail: detailEn,
    profile: profileEn,
    group: groupEn,
    search: searchEn,
    message: messageEn,
    addGroup: addGroupEn,
    setting: settingEn,
    about: aboutEn,
    interval: intervalEn,
  },
  se: {
    feed: feedSe,
    add: addSe,
    global: globalSe,
    detail: detailSe,
    profile: profileSe,
    group: groupSe,
    search: searchSe,
    message: messageSe,
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
