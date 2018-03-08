import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Image, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@assets/icons/ic_share_white.png';
import IconDark from '@assets/icons/ic_share_dark.png';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  darkIcon: {
    position: 'absolute',
    top: 15,
    left: 1,
  },
});

class ShareButton extends PureComponent {
  render() {
    const { style, onPress, animated } = this.props;
    const { navigation } = this.props;

    const params = navigation.state.params || {};

    if (animated) {
      let opacity = 1;
      let reverseOpacity = 0;
      if (params.animatedValue) {
        opacity = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [1, 0],
        });
        reverseOpacity = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 1],
        });
      }

      return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
          <Animated.Image source={Icon} style={[styles.icon, { opacity }]} />
          <Animated.Image
            source={IconDark}
            style={[styles.icon, styles.darkIcon, { opacity: reverseOpacity }]}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <Image source={IconDark} style={styles.icon} />
      </TouchableOpacity>
    );
  }
}

ShareButton.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  animated: PropTypes.bool,
  navigation: PropTypes.shape().isRequired,
};

ShareButton.defaultProps = {
  style: {},
  animated: true,
};

export default withNavigation(ShareButton);
