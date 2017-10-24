import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  backButton: {
    textAlign: 'center',
    margin: 32,
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
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
};

BackButton.defaultProps = {
  style: {},
};

export default BackButton;
