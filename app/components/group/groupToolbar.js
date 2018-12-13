import React, { PureComponent } from 'react';
import { Animated, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { Heading } from '@components/utils/texts';

import Icon from '@assets/icons/ic_back_toolbar.png';
import Map from '@assets/map_toggle.png';

const styles = StyleSheet.create({
  wrapper: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    zIndex: 100,
  },
  floated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gradientWrapper: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 2,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  spacer: {
    width: 42,
  },
});


class GroupToolBar extends PureComponent {
  backButton = () => {
    const { navigation, transparent, animatable } = this.props;
    const params = navigation.state.params || {};

    let elevation = transparent ? 5 : 0;
    if (transparent && animatable) {
      if (params.animatedValue) {
        elevation = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [5, 0],
          extrapolate: 'clamp',
        });
      }
    }

    return (
      <View style={styles.iconWrapper}>
        <TouchableHighlight onPress={() => this.backHandler()} style={styles.button}>
          <Animated.View style={[styles.icon, { elevation }]}>
            <Image source={Icon} />
          </Animated.View>
        </TouchableHighlight>
      </View>
    );
  }

  backHandler = () => {
    const { navigation, onBack, nav } = this.props;

    if (typeof onBack === 'function') {
      return onBack();
    }

    if (nav.routes.length <= 1) {
      return navigation.replace('Tab');
    }

    return navigation.goBack();
  }

  title = (groupNameVisibility) => {
    const { title } = this.props;
    if (title) {
      return (
        <Animated.View style={{ opacity: groupNameVisibility, width: '60%', alignItems: 'center' }}>
          <Heading size={22} fontVariation="bold" center numberOfLines={1} ellipsizeMode="tail" color={Colors.text.darkGray}>{title}</Heading>
        </Animated.View>
      );
    }

    return <View />;
  }

  right = (groupNameVisibility, mapPress) =>
    (
      <Animated.View style={{ opacity: groupNameVisibility, position: 'absolute', right: 0, top: -4 }}>
        <TouchableOpacity onPress={() => mapPress()} style={styles.mapWrapper}>
          <Image source={Map} style={styles.mapImg} />
        </TouchableOpacity>
      </Animated.View>
    )


  render() {
    const { navigation, transparent, offset, showsGradientBackground, animatable, mapPress } = this.props;
    const params = navigation.state.params || {};
    let groupNameVisibility = transparent ? 0 : 1;
    let backgroundColor = transparent ? 'transparent' : Colors.background.fullWhite;
    let elevation = transparent ? 0 : 10;
    let shadowOpacity = transparent ? 0 : 0.25;
    let opacity = transparent ? 1 : 0;

    if (transparent && animatable) {
      if (params.animatedValue) {
        groupNameVisibility = params.animatedValue.interpolate({
          inputRange: [0, 5],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });
        backgroundColor = params.animatedValue.interpolate({
          inputRange: [0, 10],
          outputRange: ['rgba(255,255,255,0)', Colors.background.fullWhite],
          extrapolate: 'clamp',
        });
        elevation = params.animatedValue.interpolate({
          inputRange: [0, 10],
          outputRange: [0, 10],
          extrapolate: 'clamp',
        });
        shadowOpacity = params.animatedValue.interpolate({
          inputRange: [0, 10],
          outputRange: [0, 0.25],
          extrapolate: 'clamp',
        });
      }
      if (params.opacityValue) {
        opacity = params.opacityValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });
      }
    }

    return (
      <Animated.View
        style={[
          styles.wrapper,
          transparent && styles.floated,
          offset && { top: offset },
          { elevation },
          { backgroundColor },
          { shadowOpacity },
          { opacity },
        ]}
      >
        {
          showsGradientBackground && <View style={styles.gradientWrapper}>
            <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']} style={{ height: 70 }} />
          </View>
        }
        <Animated.View style={[
          styles.toolbar,
          { backgroundColor },
        ]}
        >
          {this.backButton()}
          {this.title(groupNameVisibility)}
          <View style={styles.iconWrapper} />
          {this.right(groupNameVisibility, mapPress)}
        </Animated.View>
      </Animated.View>
    );
  }
}
GroupToolBar.propTypes = {
  title: PropTypes.string,
  transparent: PropTypes.bool,
  showsGradientBackground: PropTypes.bool,
  animatable: PropTypes.bool,
  offset: PropTypes.number,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  onBack: PropTypes.func,
  right: PropTypes.func,
  mapPress: PropTypes.func,
  nav: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

GroupToolBar.defaultProps = {
  title: '',
  transparent: false,
  showsGradientBackground: true,
  animatable: true,
  offset: null,
  onBack: null,
  right: null,
  mapPress: () => { },
};

const mapStateToProps = state => ({ nav: state.nav });

export default compose(connect(mapStateToProps), withNavigation)(GroupToolBar);
