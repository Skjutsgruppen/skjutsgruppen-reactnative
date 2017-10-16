import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const CustomButton = ({ children, style, onPress, bgColor, textColor }) => (
  <TouchableOpacity style={[styles.button, style, { backgroundColor: bgColor }]} onPress={onPress}>
    <Text style={[styles.text, { color: textColor }]}>{children}</Text>
  </TouchableOpacity>
);

CustomButton.propTypes = {
  children: PropTypes.string.isRequired,
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

CustomButton.defaultProps = {
  style: {},
  bgColor: '#333',
  textColor: '#fff',
};

export default CustomButton;
