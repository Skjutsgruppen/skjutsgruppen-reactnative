import React from 'react';
import { StyleSheet, ViewPropTypes, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

const ModalAction = ({ style, label, onPress }) => (
  <TouchableOpacity
    style={[styles.action, style]}
    onPress={onPress}
  >
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

ModalAction.propTypes = {
  style: ViewPropTypes.style,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ModalAction.defaultProps = {
  style: {},
};

export default ModalAction;

