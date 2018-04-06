import React from 'react';
import { TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Title } from '@components/utils/texts';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
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
    <Title centered fontVariation="bold" color={textColor}>{children}</Title>
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
