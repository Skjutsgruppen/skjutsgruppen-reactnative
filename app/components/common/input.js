import React from 'react';
import { StyleSheet, View, TextInput, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
  },
  input: {
    height: 48,
    fontFamily: 'SFUIText-Regular',
    textAlign: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.background.fullWhite,
    fontSize: 16,
  },
  topShadow: {
    position: 'absolute',
    top: -5,
    left: 0,
    right: 0,
    width: '100%',
    height: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  leftShadow: {
    position: 'absolute',
    top: 0,
    left: -2,
    right: 0,
    width: 1,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
  },
});

const Input = ({ style, placeholder, defaultValue, onChangeText, ...props }) => (
  <View style={styles.wrapper}>
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      onChangeText={onChangeText}
      underlineColorAndroid="transparent"
      defaultValue={defaultValue}
      {...props}
    />
    <View style={styles.topShadow} />
    <View style={styles.leftShadow} />
  </View>
);

Input.propTypes = {
  style: ViewPropTypes.style,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  onChangeText: PropTypes.func,
};

Input.defaultProps = {
  style: {},
  placeholder: '',
  defaultValue: '',
  onChangeText: () => { },
  bgColor: '#333',
  textColor: '#fff',
};

export default Input;
