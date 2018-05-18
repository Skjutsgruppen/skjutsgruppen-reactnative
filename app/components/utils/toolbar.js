import React, { PureComponent } from 'react';
import { Animated, StyleSheet, View, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { Heading } from '@components/utils/texts';

import Icon from '@assets/icons/ic_back_toolbar.png';

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


class ToolBar extends PureComponent {
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

  title = () => {
    const { title } = this.props;
    if (title) {
      return (<Heading size={16} fontVariation="bold" color={Colors.text.darkGray}>{title}</Heading>);
    }

    return <View />;
  }

  right = () => {
    const { right, navigation } = this.props;
    const params = navigation.state.params || {};
    let rightComponent = right;

    if (params.right) {
      rightComponent = params.right;
    }

    if (rightComponent) {
      return <View>{rightComponent()}</View>;
    }

    return <View style={styles.spacer} />;
  }

  render() {
    const { navigation, transparent, offset, showsGradientBackground, animatable } = this.props;
    const params = navigation.state.params || {};
    let backgroundColor = transparent ? 'transparent' : Colors.background.fullWhite;
    let elevation = transparent ? 0 : 10;
    let shadowOpacity = transparent ? 0 : 0.25;

    if (transparent && animatable) {
      if (params.animatedValue) {
        backgroundColor = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: ['rgba(255,255,255,0)', Colors.background.fullWhite],
          extrapolate: 'clamp',
        });
        elevation = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 10],
          extrapolate: 'clamp',
        });
        shadowOpacity = params.animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 0.25],
          extrapolate: 'clamp',
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
          {this.title()}
          {this.right()}
        </Animated.View>
      </Animated.View>
    );
  }
}
ToolBar.propTypes = {
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
  nav: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

ToolBar.defaultProps = {
  title: '',
  transparent: false,
  showsGradientBackground: true,
  animatable: true,
  offset: null,
  onBack: null,
  right: null,
};

const mapStateToProps = state => ({ nav: state.nav });

export default compose(connect(mapStateToProps), withNavigation)(ToolBar);
