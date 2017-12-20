import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  toastSuccess: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(43, 156, 72, 0.7)',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  toastError: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(173, 43, 43, 0.7)',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  toastWarning: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(173, 97, 43, 0.6)',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  msg: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

const Toast = ({ message, type }) => {
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
