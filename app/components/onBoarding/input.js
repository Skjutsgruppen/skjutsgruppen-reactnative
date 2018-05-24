import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';

const styles = StyleSheet.create({
  input: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 80,
    marginTop: 30,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.mutedBlue,
  },
});

const Input = ({ placeholder, ...props }) => (
  <TextInput
    {...props}
    placeholder={placeholder}
    underlineColorAndroid="transparent"
    style={styles.input}
  />
);

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default Input;

