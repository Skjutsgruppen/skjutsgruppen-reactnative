import React from 'react';
import { StyleSheet, View, ActivityIndicator as Loader } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const Loading = ({ style, size, color }) => (
  <View style={[styles.wrapper, style]}>
    <Loader size={size} color={color} />
  </View>
);

Loading.propTypes = {
  style: Loader.propTypes.style,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};

Loading.defaultProps = {
  style: {},
  size: 'large',
  color: '#00aeef',
};

export default Loading;
