import React from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import TouchableHighlight from '@components/touchableHighlight';
import { Colors } from '@theme';
import { Heading } from '@components/utils/texts';

const size = 84;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: 16,
    backgroundColor: Colors.background.fullWhite,
    marginLeft: 20,
    marginRight: 10,
    marginVertical: 30,
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});

const Alphabet = ({ style, onPress, letter }) => (
  <TouchableHighlight
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.wrapper, style]}
  >
    <Heading fontVariation="bold" color={Colors.text.gray}>{letter.toUpperCase()}</Heading>
  </TouchableHighlight>
);

Alphabet.propTypes = {
  style: ViewPropTypes.style,
  letter: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

Alphabet.defaultProps = {
  style: {},
  letter: null,
};

export default Alphabet;
