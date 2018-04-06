import React from 'react';
import { View } from 'react-native';
import propTypes from 'prop-types';
import { AppText } from '@components/utils/texts';

const Error = ({ text }) => (
  <View>
    <AppText>{text}</AppText>
  </View>
);

Error.propTypes = {
  text: propTypes.string,
};

Error.defaultProps = {
  text: 'An error occured while processing. Please try again later.',
};

export default Error;
