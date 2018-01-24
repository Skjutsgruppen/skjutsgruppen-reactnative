import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.background.lightGray,
    marginTop: 20,
  },
  bar: {
    height: 4,
  },
});

const ProgressBar = ({ amount, style }) => {
  let color = Colors.background.pink;
  if (amount === 100) {
    color = Colors.background.yellowGreen;
  }
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${amount}%`, backgroundColor: color }]} />
    </View>
  );
};

ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  style: View.propTypes.style,
};

ProgressBar.defaultProps = {
  style: {},
};

export default ProgressBar;
