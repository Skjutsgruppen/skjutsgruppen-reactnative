import React from 'react';
import { StyleSheet, View, ActivityIndicator as Loader } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const Loading = ({ style, size }) => (
  <View style={[styles.wrapper, style]}>
    <Loader size={size} color="#00aeef" />
  </View>
);

Loading.propTypes = {
  style: Loader.propTypes.style,
  size: PropTypes.string,
};

Loading.defaultProps = {
  style: {},
  size: 'large',
};

export default Loading;
