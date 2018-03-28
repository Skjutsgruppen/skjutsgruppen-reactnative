import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { Gradients } from '@theme';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -windowWidth * 0.1,
    left: -windowWidth * 0.1,
    height: windowWidth * 0.6,
    width: windowWidth * 0.6,
    borderRadius: (windowWidth * 0.6) / 2,
  },
});

const yOffset = -windowWidth * 0.1;
const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
);

class Circle extends PureComponent {
  render() {
    const { style, animatable, navigation } = this.props;
    const params = navigation.state.params || {};
    let top = -windowWidth * 0.1;

    if (animatable && params.animatedValue) {
      top = params.animatedValue.interpolate({
        inputRange: [0, 1000],
        outputRange: [yOffset, -1000],
      });
    }
    return (
      <AnimatedLinearGradient colors={Gradients.blue} style={[styles.circle, style, { top }]} />
    );
  }
}


Circle.propTypes = {
  style: LinearGradient.propTypes.style,
  animatable: PropTypes.bool,
  navigation: PropTypes.shape(),
};

Circle.defaultProps = {
  style: {},
  animatable: false,
  navigation: null,
};

export default withNavigation(Circle);
