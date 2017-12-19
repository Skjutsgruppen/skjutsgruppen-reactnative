import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

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
  bgColor: '#fff',
};

export default Wrapper;

