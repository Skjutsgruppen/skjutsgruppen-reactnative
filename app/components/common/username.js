import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  text: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

const Username = ({ name, style, onPress }) => (
  <Text style={[styles.text, style]} onPress={onPress}>{name} </Text>
);


Username.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: Text.propTypes.style,
};

Username.defaultProps = {
  onPress: () => {},
  style: {},
};

export default Username;
