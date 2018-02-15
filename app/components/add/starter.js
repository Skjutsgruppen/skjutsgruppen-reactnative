import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { GlobalStyles } from '@theme/styles';

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    padding: '8%',
    marginHorizontal: 20,
    marginBottom: '8%',
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    color: Colors.text.blue,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});

const Starter = ({ label, info, style, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.block, style]}
    underlayColor="#f0f0f0"
  >
    <View>
      <Text
        accessibilityLabel="Go to next form"
        style={styles.label}
      >
        {label}
      </Text>
      {
        info &&
        <Text
          style={[
            GlobalStyles.TextStyles.textCenter,
            GlobalStyles.TextStyles.light,
          ]}
        >
          {info}
        </Text>
      }
    </View>
  </TouchableHighlight>
);

Starter.propTypes = {
  label: PropTypes.string.isRequired,
  info: PropTypes.string,
  style: TouchableHighlight.propTypes.style,
  onPress: PropTypes.func,
};
Starter.defaultProps = {
  info: null,
  style: {},
  onPress: () => {},
};

export default Starter;
