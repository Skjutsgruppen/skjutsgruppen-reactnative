import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});

const Wrapper = ({ children, bgColor }) => (
  <View style={[styles.mainView, { backgroundColor: bgColor }]}>
    {children}
  </View>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
};

Wrapper.defaultProps = {
  bgColor: Colors.background.mutedBlue,
};

export default Wrapper;

