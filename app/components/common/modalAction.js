import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import TouchableHighlight from '@components/touchableHighlight';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  action: {
    padding: 16,
  },
});

const ModalAction = ({ style, label, onPress, disabled }) => (
  <TouchableHighlight
    style={[styles.action, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <View>
      <AppText centered fontVariation="bold" color={disabled ? Colors.text.gray : Colors.text.blue}>{label}</AppText>
    </View>
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

