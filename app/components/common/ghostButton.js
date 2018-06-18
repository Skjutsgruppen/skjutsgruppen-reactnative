import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
  },
});

const GhostButton = ({ style, label, color, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.button, style]}
  >
    <View>
      <AppText color={color || Colors.text.blue}>{label}</AppText>
    </View>
  </TouchableHighlight>
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
