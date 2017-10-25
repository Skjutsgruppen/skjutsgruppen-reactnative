import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  icon: {
    width: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
  text: {
    color: '#999',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

const CloseButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={require('@icons/icon_chevron_down.png')} style={styles.icon} />
    <Text style={styles.text}>Close</Text>
  </TouchableOpacity>
);

CloseButton.propTypes = {
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
};

CloseButton.defaultProps = {
  style: {},
};

export default CloseButton;
