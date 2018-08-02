import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  block: {
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 24,
    padding: '5%',
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
          centered
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
