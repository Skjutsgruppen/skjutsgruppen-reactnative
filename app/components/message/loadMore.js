import React from 'react';
import { StyleSheet, ViewPropTypes, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  more: {
    height: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadMore = ({ onPress, remainingCount, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.more, style]}>
    <AppText size={14} fontVariation="semibold" color={Colors.text.blue}>+ {remainingCount} {trans('message.more')}</AppText>
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

