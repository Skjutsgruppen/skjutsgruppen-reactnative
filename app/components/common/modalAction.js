import React from 'react';
import { StyleSheet, ViewPropTypes, Text } from 'react-native';
import TouchableHighlight from '@components/touchableHighlight';
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
  disabled: {
    color: Colors.text.gray,
  },
});

const ModalAction = ({ style, label, onPress, disabled }) => (
  <TouchableHighlight
    style={[styles.action, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.actionLabel, disabled ? styles.disabled : {}]}>{label}</Text>
  </TouchableHighlight>
);

ModalAction.propTypes = {
  style: ViewPropTypes.style,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ModalAction.defaultProps = {
  style: {},
  disabled: false,
};

export default ModalAction;

