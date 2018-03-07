import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

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
  msg: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

const Toast = ({ message, type }) => {
  if (message === '') {
    return null;
  }

  if (type === 'error') {
    return (<View style={styles.toastError}><Text style={styles.msg}>{message}</Text></View>);
  } else if (type === 'warning') {
    return (<View style={styles.toastWarning}><Text style={styles.msg}>{message}</Text></View>);
  }

  return (<View style={styles.toastSuccess}><Text style={styles.msg}>{message}</Text></View>);
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Toast;
