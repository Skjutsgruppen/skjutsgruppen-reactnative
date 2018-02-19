import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { GlobalStyles } from '@theme/styles';
import { Heading, AppText } from '@components/utils/texts';

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
    textAlign: 'center',
  },
});

const Starter = ({ label, info, style, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.block, style]}
    underlayColor="#f0f0f0"
  >
    <View>
      <Heading
        accessibilityLabel="Go to next form"
        size={24}
        color={Colors.text.blue}
        fontVariation="bold"
        style={styles.label}
      >
        {label}
      </Heading>
      {
        info &&
        <AppText
          size={15}
          color={Colors.text.gray}
          style={[
            GlobalStyles.TextStyles.textCenter,
            { marginTop: 12 },
          ]}
        >
          {info}
        </AppText>
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
