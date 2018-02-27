import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewPropTypes, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  icon: {
    height: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
  text: {
    color: '#999',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

const BackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={require('@assets/icons/ic_back_toolbar.png')} style={styles.icon} />
    <Text style={styles.text}>Back</Text>
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
