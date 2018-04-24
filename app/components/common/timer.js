import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Pie from 'react-native-pie';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  timerWrapper: {
    marginLeft: 'auto',
  },
  timer: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingTime: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

const Timer = ({ timeFraction, duration }) => (
  <View style={styles.timerWrapper}>
    <View style={styles.timer}>
      <Pie
        radius={18}
        innerRadius={15}
        series={[100, timeFraction || 0]}
        colors={['#0057db', '#d0e2f9']}
      />
      <View style={styles.remainingTime}>
        <Text style={{ color: '#0057db', fontWeight: 'bold' }}>{duration}</Text>
      </View>
    </View>
  </View>
);

Timer.propTypes = {
  timeFraction: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default Timer;
