import React from 'react';
import Moment from 'react-moment';
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/sv';
import { Text } from 'react-native';
import 'moment-timezone';
import { getTimezone } from '@helpers/device';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';

Moment.globalElement = Text;
Moment.startPooledTimer();

const changeFormat = (format) => {
  if (format.includes('DD')) {
    return format.replace('DD', 'MMM').replace('MMM', 'DD');
  } else if (format.includes('Do')) {
    return format.replace('Do', 'MMM').replace('MMM', 'Do');
  }
  return format;
};

export const isToday = dateTime => (moment(new Date(dateTime)).format('YYYYMMDD') === moment().format('YYYYMMDD'));

export const isWithinAWeek = dateTime => moment(new Date(dateTime)).isAfter(moment().subtract(7, 'days'));

export const isBeforeAWeek = dateTime => moment(new Date(dateTime)).isBefore(moment().subtract(7, 'days'));

export const isDifferentYear = dateTime => (moment(new Date(dateTime)).format('YYYY') !== moment().format('YYYY'));

export const isFuture = dateTime => moment.tz(dateTime, getTimezone()).isAfter(moment());

const DateView = ({ children, format, calendarTime, ...rest }) => {
  let autoFormat = 'MMM Do';
  let defaultFormat = format;
  if (isToday(children)) {
    autoFormat = 'HH:mm';
  }

  if (isWithinAWeek(children) && !isToday(children)) {
    autoFormat = 'ddd';
  }

  if (isBeforeAWeek(children)) {
    autoFormat = 'MMM DD';
  }

  if (isBeforeAWeek(children) && isDifferentYear(children)) {
    autoFormat = 'MMM DD, YYYY';
  }

  if (calendarTime) {
    defaultFormat = autoFormat;
  }

  if (defaultFormat && I18n.locale === 'sv') {
    defaultFormat = changeFormat(defaultFormat);
    console.log(defaultFormat);
  }

  // Moment.globalLocale = lang;

  return (
    <Moment locale={I18n.locale} fromNow format={defaultFormat} {...rest} tz={getTimezone()}>
      {new Date(children)}
    </Moment>
  );
};

DateView.propTypes = {
  children: PropTypes.string.isRequired,
  format: PropTypes.string,
  calendarTime: PropTypes.bool,
};

DateView.defaultProps = {
  format: null,
  calendarTime: false,
};

export default DateView;
