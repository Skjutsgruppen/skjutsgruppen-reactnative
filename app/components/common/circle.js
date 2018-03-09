import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
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

const yOffset = -Dimensions.get('window').width * 0.1;
const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
);

class Circle extends PureComponent {
  render() {
    const { style, animatable, navigation } = this.props;
    const params = navigation.state.params || {};
    let top = 200;

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
