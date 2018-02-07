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

const ProgressBar = ({ amount, style, color }) => {
  let progressColor = color;
  if (amount === 100) {
    progressColor = Colors.background.yellowGreen;
  }
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${amount}%`, backgroundColor: progressColor }]} />
    </View>
  );
};

ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  style: View.propTypes.style,
  color: PropTypes.string,
};

ProgressBar.defaultProps = {
  style: {},
  color: Colors.background.pink,
};

export default ProgressBar;
