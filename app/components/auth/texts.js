import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  greetText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.green,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  coloredText: {
    alignSelf: 'center',
    width: 250,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 24,
    marginHorizontal: 24,
  },
});

export const GreetText = ({ children, style }) => (
  <Text style={[styles.greetText, style]}>{children}</Text>
);

GreetText.propTypes = {
  children: PropTypes.node.isRequired,
  style: View.propTypes.style,
};

GreetText.defaultProps = {
  style: {},
};


export const ColoredText = ({ children, style, color }) => (
  <Text style={[styles.coloredText, { color }, style]}>{children}</Text>
);

ColoredText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  style: View.propTypes.style,
  color: PropTypes.string.isRequired,
};

ColoredText.defaultProps = {
  style: {},
};
