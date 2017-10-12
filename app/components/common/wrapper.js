import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});

const Wrapper = ({ children, bgColor }) => (
  <ScrollView keyboardShouldPersistTaps="handled" style={[styles.mainView, { backgroundColor: bgColor }]}>
    {children}
  </ScrollView>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
};

Wrapper.defaultProps = {
  bgColor: '#fff',
};

export default Wrapper;

