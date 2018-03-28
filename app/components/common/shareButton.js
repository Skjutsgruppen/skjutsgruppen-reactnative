import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import TouchableHighlight from '@components/touchableHighlight';

import Icon from '@assets/icons/ic_share_white.png';
import IconDark from '@assets/icons/ic_share_dark.png';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  icon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  darkIcon: {
    position: 'absolute',
    top: 2,
    left: 1,
  },
});

class ShareButton extends PureComponent {
  render() {
    const { style, onPress, animated } = this.props;
    const { navigation } = this.props;

    const params = navigation.state.params || {};

    let opacity = 1;
    let reverseOpacity = 0;
    if (animated) {
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
        <View style={styles.iconWrapper}>
          <TouchableHighlight onPress={onPress} style={[styles.button, style]}>
            <View>
              <Animated.Image
                source={Icon}
                style={[styles.icon, animated ? { opacity } : reverseOpacity]}
              />
              <Animated.Image
                source={IconDark}
                style={[
                  styles.icon,
                  styles.darkIcon,
                  animated ? { opacity: reverseOpacity } : { opacity },
                ]}
              />
            </View>
          </TouchableHighlight>
        </View>
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
