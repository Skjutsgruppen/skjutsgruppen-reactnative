import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginVertical: 6,
  },
  toastSuccess: {
    backgroundColor: 'rgba(43, 156, 72, 0.7)',
  },
  toastError: {
    backgroundColor: 'rgba(173, 43, 43, 0.7)',
  },
  toastWarning: {
    backgroundColor: 'rgba(173, 97, 43, 0.6)',
  },
});

const Toast = ({ message, type, style }) => {
  if (message === '') {
    return null;
  }

  if (type === 'error') {
    return (<View style={[styles.wrapper, styles.toastError, style]}>
      <AppText centered color={Colors.text.white}>{message}</AppText></View>);
  } else if (type === 'warning') {
    return (<View style={[styles.wrapper, styles.toastWarning, style]}>
      <AppText centered color={Colors.text.white}>{message}</AppText></View>);
  }

  return (<View style={[styles.wrapper, styles.toastSuccess, style]}>
    <AppText centered color={Colors.text.white}>{message}</AppText></View>);
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

Toast.defaultProps = {
  style: {},
};

export default Toast;
