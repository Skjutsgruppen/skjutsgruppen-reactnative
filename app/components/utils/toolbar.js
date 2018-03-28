import React, { PureComponent } from 'react';
import { Animated, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';

import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';

import Icon from '@assets/icons/ic_back_toolbar.png';

const styles = StyleSheet.create({
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
  title: {
    fontWeight: 'bold',
    color: '#707070',
    backgroundColor: 'transparent',
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
    const { navigation, onBack, transparent } = this.props;
    const params = navigation.state.params || {};
    let backHandler = navigation.goBack;

    if (typeof onBack === 'function') {
      backHandler = onBack;
    }

    let elevation = transparent ? 5 : 0;
    if (transparent) {
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
        <TouchableHighlight onPress={() => backHandler()} style={styles.button}>
          <Animated.View style={[styles.icon, { elevation }]}>
            <Image source={Icon} />
          </Animated.View>
        </TouchableHighlight>
      </View>
    );
  }

  title = () => {
    const { title } = this.props;
    if (title) {
      return (<Text style={styles.title}>{title}</Text>);
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
    const { navigation, transparent, offset } = this.props;
    const params = navigation.state.params || {};
    let backgroundColor = transparent ? 'transparent' : Colors.background.fullWhite;
    let elevation = transparent ? 0 : 10;
    if (transparent) {
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
      }
    }

    return (
      <Animated.View
        style={[
          transparent && styles.floated,
          offset && { top: offset },
          { elevation },
          { backgroundColor },
        ]}
      >
        <View style={styles.gradientWrapper}>
          <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']} style={{ height: 70 }} />
        </View>
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
  offset: PropTypes.number,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  onBack: PropTypes.func,
  right: PropTypes.func,
};

ToolBar.defaultProps = {
  title: '',
  transparent: false,
  offset: null,
  onBack: null,
  right: null,
};

export default withNavigation(ToolBar);
