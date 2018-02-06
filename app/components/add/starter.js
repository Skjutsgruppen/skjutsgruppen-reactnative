import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import PropTypes from 'prop-types';

import { GlobalStyles } from '@theme/styles';
import { StartStyles } from '@theme/styles/add';

const Starter = ({ label, info, style, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[StartStyles.block, style]}
    underlayColor="#f0f0f0"
  >
    <View>
      <Text
        accessibilityLabel="Go to next form"
        style={StartStyles.label}
      >
        {label}
      </Text>
      {
        info &&
        <Text
          style={[
            GlobalStyles.TextStyles.textCenter,
            GlobalStyles.TextStyles.lightText,
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
