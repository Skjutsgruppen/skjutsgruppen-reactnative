import React from 'react';
import Moment from 'react-moment';
import { Text } from 'react-native';
import 'moment-timezone';
import { getTimezone } from '@services/device';
import PropTypes from 'prop-types';

Moment.globalElement = Text;
Moment.startPooledTimer();

const DateView = ({ children, format, ...rest }) => (
  <Moment fromNow format={format} {...rest} tz={getTimezone()}>
    {new Date(children)}
  </Moment>
);

DateView.propTypes = {
  children: PropTypes.string.isRequired,
  format: PropTypes.string,
};

DateView.defaultProps = {
  format: null,
};

export default DateView;
