import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const styles = StyleSheet.create({
  more: {},
});

class MoreButton extends PureComponent {
  render() {
    const { style, onPress, animated } = this.props;
    const { navigation } = this.props;

    const params = navigation.state.params || {};

    let color = '#fff';
    if (animated) {
      if (params.animatedValue) {
        color = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: ['#fff', '#888'],
          extrapolate: 'clamp',
        });
      }
    }

    return (
      <TouchableOpacity style={[styles.more, style]} onPress={onPress}>
        <AnimatedIcon
          name="ios-more"
          size={48}
          style={{ color }}
        />
      </TouchableOpacity>
    );
  }
}

MoreButton.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  animated: PropTypes.bool,
  navigation: PropTypes.shape({}).isRequired,
};

MoreButton.defaultProps = {
  style: {},
  animated: true,
};

export default withNavigation(MoreButton);
