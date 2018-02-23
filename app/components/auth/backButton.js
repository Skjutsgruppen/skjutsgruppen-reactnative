import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  backButton: {
    textAlign: 'center',
    padding: 12,
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
    textDecorationLine: 'underline',
    textDecorationColor: '#333',
    color: '#333',
  },
});

const BackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.backButton, style]}>Go back</Text>
  </TouchableOpacity>
);

BackButton.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
};

BackButton.defaultProps = {
  style: {},
};

export default BackButton;
