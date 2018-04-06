import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  toastSuccess: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(43, 156, 72, 0.7)',
  },
  toastError: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(173, 43, 43, 0.7)',
  },
  toastWarning: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(173, 97, 43, 0.6)',
  },
});

const Toast = ({ message, type }) => {
  if (message === '') {
    return null;
  }

  if (type === 'error') {
    return (<View style={styles.toastError}>
      <AppText centered color={Colors.text.white}>{message}</AppText></View>);
  } else if (type === 'warning') {
    return (<View style={styles.toastWarning}>
      <AppText centered color={Colors.text.white}>{message}</AppText></View>);
  }

  return (<View style={styles.toastSuccess}>
    <AppText centered color={Colors.text.white}>{message}</AppText></View>);
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Toast;
