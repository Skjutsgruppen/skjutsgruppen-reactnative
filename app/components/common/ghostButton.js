import React from 'react';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.text.blue,
  },
});

const GhostButton = ({ style, label, color, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.button, style]}
    underlayColor={Colors.background.lightGray}
  >
    <View>
      <Text style={[styles.label, color ? { color } : {}]}>{label}</Text>
    </View>
  </TouchableHighlight>
);

GhostButton.propTypes = {
  style: View.propTypes.style,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

GhostButton.defaultProps = {
  style: {},
  color: null,
};

export default GhostButton;
