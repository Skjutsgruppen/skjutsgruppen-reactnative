
import I18n from 'react-native-i18n';
import LangService from '@services/lang';

import {
  feed as feedEn,
  add as addEn,
  global as globalEn,
  detail as detailEn,
  search as searchEn,
  profile as profileEn,
  group as groupEn,
  message as messageEn,
  experience as experienceEn,
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
  search as searchSe,
  profile as profileSe,
  group as groupSe,
  message as messageSe,
  experience as experienceSe,
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
    search: searchEn,
    profile: profileEn,
    group: groupEn,
    message: messageEn,
    experience: experienceEn,
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
    search: searchSe,
    profile: profileSe,
    group: groupSe,
    message: messageSe,
    experience: experienceSe,
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
