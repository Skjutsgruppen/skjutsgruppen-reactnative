import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 12,
    marginTop: 12,
  },
});


const Container = ({ children, bgColor }) => (
  <ScrollView keyboardShouldPersistTaps="handled" style={[styles.wrapper, { backgroundColor: bgColor }]}>
    {children}
  </ScrollView>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
};

Container.defaultProps = {
  bgColor: '#fff',
};


export default Container;
