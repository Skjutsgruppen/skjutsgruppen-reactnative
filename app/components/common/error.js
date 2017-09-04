import React from 'react';
import { View, Text } from 'react-native';
import propTypes from 'prop-types';

const Error = ({ text }) => (
  <View>
    <Text>{text}</Text>
  </View>
);

Error.propTypes = {
  text: propTypes.string,
};

Error.defaultProps = {
  text: 'An error occured while processing. Please try again later.',
};

export default Error;
