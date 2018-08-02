import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { Gradients } from '@theme';

const windowWidth = Dimensions.get('window').width;
const size = windowWidth * 0.78;

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -(size * 0.17),
    left: -(size * 0.23),
    height: size,
    width: size,
    borderRadius: size / 2,
  },
});

const yOffset = -(size * 0.17);
const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
);


class Circle extends PureComponent {
  render() {
    const { style, animatable, navigation } = this.props;
    const params = navigation.state.params || {};
    let top = -(size * 0.17);

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
