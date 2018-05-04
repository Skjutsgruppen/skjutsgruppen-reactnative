import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import TouchableHighlight from '@components/touchableHighlight';
import { Title } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
  },
});

const RoundedButton = ({ children, style, onPress, bgColor, textColor }) => (
  <View style={[styles.wrapper, style]}>
    <TouchableHighlight
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Title fontVariation="bold" centered style={[styles.text, { color: textColor }]}>{children}</Title>
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
