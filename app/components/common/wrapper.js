import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});

const Wrapper = ({ children, bgColor, style, ...props }) => (
  <View style={[styles.mainView, style, { backgroundColor: bgColor }]} {...props}>
    {children}
  </View>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  style: ViewPropTypes.style,
};

Wrapper.defaultProps = {
  bgColor: Colors.background.mutedBlue,
  style: {},
};

export default Wrapper;

