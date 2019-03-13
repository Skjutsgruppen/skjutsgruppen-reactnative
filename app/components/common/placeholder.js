import React, { Component } from 'react';
import { View, Animated, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  placeholderTextWrapper: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
  },
  placeholderText: {
    width: '50%',
    height: 10,
    margin: 10,
    marginTop: 0,
    borderRadius: 5,
  },
  placeholderTextSecond: {
    height: 10,
    margin: 10,
    marginTop: 0,
    borderRadius: 5,
  },
});

class Placeholder extends Component {
  state = {
    animValue: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animValue, {
          duration: 800,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.animValue, {
          duration: 800,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]), {
        iterations: -1,
      },
    ).start();
  }

  render() {
    const { count, color, wrapperStyle } = this.props;

    const rows = Array.from({ length: count }, (x, i) => i);

    const opacity = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    const backgroundColor = { backgroundColor: color };

    return (
      <View style={wrapperStyle}>
        {
          rows.map(row => (
            <Animated.View style={[styles.placeholder, { opacity }]} key={row}>
              <View style={[styles.placeholderImage, backgroundColor]} />
              <View style={styles.placeholderTextWrapper}>
                <View style={[styles.placeholderText, backgroundColor]} />
                <View style={[styles.placeholderTextSecond, backgroundColor]} />
              </View>
            </Animated.View>
          ))
        }
      </View>
    );
  }
}

Placeholder.propTypes = {
  count: PropTypes.number,
  color: PropTypes.string,
  wrapperStyle: ViewPropTypes.style,
};

Placeholder.defaultProps = {
  count: 1,
  color: '#ddd',
  wrapperStyle: {},
};

export default Placeholder;
