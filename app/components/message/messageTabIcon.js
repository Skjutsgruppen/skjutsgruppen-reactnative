import React, { Component } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { compose } from 'react-apollo';
import { Colors } from '@theme';
import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';
import PropTypes from 'prop-types';
import { withUnreadNotification, withLocationSharedToAllResources } from '@services/apollo/notification';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: '100%',
    width: '100%',
  },
  indicatorIcon: {
    position: 'absolute',
    top: 8,
    right: 12,
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.background.blue,
    borderWidth: 2,
    borderColor: '#fff',
  },
  pulseAnimationWrapper: {
    position: 'absolute',
    height: 60,
    width: 60,
  },
  glow: {
    backgroundColor: 'rgba(158, 4, 158, 0.25)',
    borderRadius: 30,
    height: 60,
    opacity: 0,
    transform: [
      { scale: 0 },
    ],
    width: 60,
    position: 'absolute',
  },
});

class MessageTabIcon extends Component {
  constructor() {
    super();
    this.state = {
      animationFirst: new Animated.Value(0.01),
      animationSecond: new Animated.Value(0.01),
    };
  }

  componentDidMount() {
    const { animationFirst, animationSecond } = this.state;
    Animated.loop(
      Animated.stagger(400,
        [
          Animated.timing(animationFirst, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animationSecond, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ],
      ),
    ).start();
  }
  render() {
    const { unreadNotifications, focused, loading, ...otherProps } = this.props;
    const { animationFirst, animationSecond } = this.state;

    const opacity = animationFirst.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const scale = animationFirst.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const opacitySecond = animationSecond.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const scaleSecond = animationSecond.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const animatedStyle = {
      transform: [
        { scale },
      ],
      opacity,
    };

    const animatedStyleSecond = {
      transform: [
        { scale: scaleSecond },
      ],
      opacity: opacitySecond,
    };


    return (
      <View style={[styles.wrapper]} >
        {otherProps.locationSharedToAllResources.count > 0 && (
          <View style={styles.pulseAnimationWrapper}>
            <Animated.View
              style={[
                styles.glow,
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.glow,
                { backgroundColor: 'rgba(158, 4, 158, 0.25)' },
                animatedStyleSecond,
              ]}
            />
          </View>)
        }
        <Image source={focused ? MessageIconActive : MessageIcon} />
        {!loading && unreadNotifications > 0 && <View style={styles.indicatorIcon} />}
      </View>
    );
  }
}

MessageTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
  unreadNotifications: PropTypes.number,
  loading: PropTypes.bool.isRequired,
};

MessageTabIcon.defaultProps = {
  unreadNotifications: 0,
};

export default compose(withUnreadNotification, withLocationSharedToAllResources)(MessageTabIcon);
