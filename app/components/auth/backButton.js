import React from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  backButton: {
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
    <AppText centered style={[styles.backButton, style]}>Go back</AppText>
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
