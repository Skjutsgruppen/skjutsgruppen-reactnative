import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
  },
});

const GhostButton = ({ style, label, color, onPress }) => (
  <View style={{ overflow: 'hidden', flex: 1 }}>
    <TouchableHighlight
      onPress={onPress}
      style={[styles.button, style]}
    >
      <AppText color={color || Colors.text.blue}>{label}</AppText>
    </TouchableHighlight>
  </View>
);

GhostButton.propTypes = {
  style: ViewPropTypes.style,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

GhostButton.defaultProps = {
  style: {},
  color: null,
};

export default GhostButton;
