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
} from './locales/en';
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
} from './locales/se';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    global: globalEn,
    feed: feedEn,
    profile: profileEn,
    group: groupEn,
    search: searchEn,
    message: messageEn,
    add: addEn,
    trip: tripEn,
    addGroup: addGroupEn,
    setting: settingEn,
  },
  se: {
    global: globalSe,
    feed: feedSe,
    profile: profileSe,
    group: groupSe,
    search: searchSe,
    message: messageSe,
    add: addSe,
    trip: tripSe,
    addGroup: addGroupSe,
    setting: settingSe,
  },
};

async function loadLocal() {
  const lang = await LangService.getLanguage();
  I18n.locale = lang;
}

loadLocal();

export function trans(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
