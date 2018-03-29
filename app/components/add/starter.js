import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { GlobalStyles } from '@theme/styles';
import { Heading, AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    marginBottom: '8%',
    marginHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  block: {
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 24,
    padding: '5%',
  },
  label: {
    textAlign: 'center',
  },
});

const Starter = ({ label, info, style, onPress }) => (
  <View style={styles.wrapper}>
    <TouchableHighlight
      onPress={onPress}
      style={[styles.block, style]}
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
  </View>
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
  onPress: () => { },
};

export default Starter;
