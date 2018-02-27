import React, { PureComponent } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Icon from '@assets/icons/ic_back_toolbar.png';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
  },
  floated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    height: 42,
    width: 42,
    borderRadius: 21,
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
      <TouchableOpacity onPress={() => backHandler()} style={styles.button}>
        <Animated.View style={[styles.iconWrapper, { elevation }]}>
          <Image source={Icon} />
        </Animated.View>
      </TouchableOpacity>
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
      <Animated.View style={[
        styles.wrapper,
        transparent && styles.floated,
        { backgroundColor },
        { elevation },
        offset && { top: offset },
      ]}
      >
        {this.backButton()}
        {this.title()}
        {this.right()}
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
