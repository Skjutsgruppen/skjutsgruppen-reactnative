import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '@theme';

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -Dimensions.get('window').width * 0.1,
    left: -Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.6,
    width: Dimensions.get('window').width * 0.6,
    borderRadius: (Dimensions.get('window').width * 0.6) / 2,
  },
});

const Circle = ({ style }) => (
  <LinearGradient colors={Gradients.blue} style={[styles.circle, style]} />
);


Circle.propTypes = {
  style: LinearGradient.propTypes.style,
};

Circle.defaultProps = {
  style: {},
};

export default Circle;
