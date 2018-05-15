import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import { Text } from 'react-native';
import 'moment-timezone';
import { getTimezone } from '@helpers/device';
import PropTypes from 'prop-types';

Moment.globalElement = Text;
Moment.startPooledTimer();

export const isToday = dateTime => (moment.tz(dateTime, getTimezone()).format('YYYYMMDD') === moment().format('YYYYMMDD'));

export const isWithinAWeek = dateTime => moment.tz(dateTime, getTimezone()).isAfter(moment().subtract(7, 'days'));

export const isBeforeAWeek = dateTime => moment.tz(dateTime, getTimezone()).isBefore(moment().subtract(7, 'days'));

export const isDifferentYear = dateTime => (moment.tz(dateTime, getTimezone()).format('YYYY') !== moment().format('YYYY'));

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

  return (
    <Moment fromNow format={defaultFormat} {...rest} tz={getTimezone()}>
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
