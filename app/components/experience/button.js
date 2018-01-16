import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Chevron from '@icons/ic_chevron_white.png';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 132,
    height: 40,
    borderRadius: 24,
    backgroundColor: Colors.background.pink,
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  backIcon: {
    marginRight: 12,
    transform: [
      { rotate: '180deg' },
    ],
  },
  nextIcon: {
    marginLeft: 12,
  },
});

const Button = ({ label, icon, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {icon === 'back' && <Image source={Chevron} style={styles.backIcon} />}
    <Text style={styles.buttonLabel}>{label}</Text>
    {icon === 'next' && <Image source={Chevron} style={styles.nextIcon} />}
  </TouchableOpacity>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: View.propTypes.style,
};

Button.defaultProps = {
  icon: null,
  style: {},
};

export default Button;
