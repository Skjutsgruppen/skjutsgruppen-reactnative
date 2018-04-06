import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  errorText: {
    lineHeight: 32,
  },
});

const Retry = ({ onPress, style }) => (
  <View style={[styles.wrapper, style]}>
    <AppText centered color={Colors.text.gray} style={styles.errorText}>{trans('global.oops_something_went_wrong')}</AppText>
    <TouchableOpacity onPress={onPress}>
      <AppText centered color={Colors.text.gray} style={styles.errorText}>{trans('global.tap_to_retry')}</AppText>
    </TouchableOpacity>
  </View>
);

Retry.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
};

Retry.defaultProps = {
  style: {},
};

export default Retry;
