import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

const RoundedButton = ({ children, style, onPress, bgColor, textColor }) => (
  <TouchableOpacity style={[styles.button, style, { backgroundColor: bgColor }]} onPress={onPress}>
    <Text style={[styles.text, { color: textColor }]}>{children}</Text>
  </TouchableOpacity>
);

RoundedButton.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

RoundedButton.defaultProps = {
  style: {},
  bgColor: '#333',
  textColor: '#fff',
};

export default RoundedButton;
