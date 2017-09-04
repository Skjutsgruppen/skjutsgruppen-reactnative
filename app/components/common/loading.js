import React from 'react';
import { View, Text } from 'react-native';
import propTypes from 'prop-types';

const Loading = ({ text }) => (
  <View>
    <Text>{text}</Text>
  </View>
);

Loading.propTypes = {
  text: propTypes.string,
};

Loading.defaultProps = {
  text: 'Loading...',
};

export default Loading;
