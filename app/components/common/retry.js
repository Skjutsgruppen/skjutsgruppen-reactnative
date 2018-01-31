import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
});

const Retry = ({ onPress, style }) => (
  <View style={[styles.wrapper, style]}>
    <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
    </TouchableOpacity>
  </View>
);

Retry.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: View.propTypes.style,
};

Retry.defaultProps = {
  style: {},
};

export default Retry;
