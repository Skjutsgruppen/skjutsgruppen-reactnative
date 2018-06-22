import React from 'react';
import { StyleSheet, View, ViewPropTypes, Image } from 'react-native';
import TouchableHighlight from '@components/touchableHighlight';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  action: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 26,
    resizeMode: 'contain',
    marginRight: 12,
  },
});

const ModalAction = ({ style, label, onPress, disabled, icon }) => (
  <TouchableHighlight
    style={[styles.action, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.content}>
      {icon && <Image source={icon} style={styles.icon} />}
      <AppText centered color={disabled ? Colors.text.gray : Colors.text.blue}>{label}</AppText>
    </View>
  </TouchableHighlight>
);

ModalAction.propTypes = {
  style: ViewPropTypes.style,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOf(PropTypes.number, PropTypes.string),
};

ModalAction.defaultProps = {
  style: {},
  disabled: false,
  icon: null,
};

export default ModalAction;

