import React from 'react';
import Moment from 'react-moment';
import { Text } from 'react-native';
import 'moment-timezone';
import { getTimezone } from '@services/device';
import PropTypes from 'prop-types';

Moment.globalElement = Text;
Moment.startPooledTimer();

const DateView = ({ children, ...rest }) => (
  <Moment fromNow {...rest} tz={getTimezone()}>
    {new Date(children)}
  </Moment>
);

DateView.propTypes = {
  children: PropTypes.string.isRequired,
};

export default DateView;
