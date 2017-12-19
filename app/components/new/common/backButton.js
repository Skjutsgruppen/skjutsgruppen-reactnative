import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@icons/ic_chevron_left.png';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
});

const BackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={Icon} style={styles.icon} />
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
