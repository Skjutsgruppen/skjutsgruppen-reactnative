import React from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';

const styles = StyleSheet.create({
  wrapper: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.gray,
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    color: Colors.text.white,
    fontSize: 13,
  },
  active: {
    backgroundColor: Colors.background.blue,
  },
});

const Filter = ({ style, label, onPress, active }) => (
  <TouchableHighlight
    style={[styles.wrapper, style, active ? styles.active : {}]}
    underlayColor={Colors.background.lightGray}
    onPress={onPress}
  >
    <Text style={styles.label}>{label}</Text>
  </TouchableHighlight>
);

Filter.propTypes = {
  style: TouchableHighlight.propTypes.style,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  active: PropTypes.bool.isRequired,
};

Filter.defaultProps = {
  style: {},
  onPress: () => {},
};

export default Filter;

