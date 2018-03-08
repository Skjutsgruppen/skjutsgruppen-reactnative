import React from 'react';
import { StyleSheet, ViewPropTypes, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  more: {
    height: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.blue,
  },
});

const LoadMore = ({ onPress, remainingCount, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.more, style]}>
    <Text style={styles.moreText}>+ {remainingCount} {trans('message.more')}</Text>
  </TouchableOpacity>
);

LoadMore.propTypes = {
  onPress: PropTypes.func.isRequired,
  remainingCount: PropTypes.number.isRequired,
  style: ViewPropTypes.style,
};

LoadMore.defaultProps = {
  style: {},
};

export default LoadMore;

