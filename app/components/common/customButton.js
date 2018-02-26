import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#ddd',
  },
});

const CustomButton = ({ children, style, onPress, bgColor, textColor, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      style,
      { backgroundColor: bgColor },
      disabled && styles.disabled,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={[styles.text, { color: textColor }]}>{children}</Text>
  </TouchableOpacity>
);

CustomButton.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
  style: {},
  bgColor: '#333',
  textColor: '#fff',
  disabled: false,
};

export default CustomButton;
