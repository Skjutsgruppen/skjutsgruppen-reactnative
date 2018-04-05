import React from 'react';
import { View, Text, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  wrapper: {
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

const RoundedButton = ({ children, style, onPress, bgColor, textColor }) => (
  <View style={[styles.wrapper, style]}>
    <TouchableHighlight
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </TouchableHighlight>
  </View>
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
