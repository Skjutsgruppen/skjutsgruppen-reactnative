import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.gray,
    marginRight: 6,
    marginBottom: 6,
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
    <Text style={{ fontSize: 13, color: Colors.text.white }}>{label}</Text>
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

