import React, { PureComponent } from 'react';
import { ViewPropTypes, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }
  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ animatedValue: this.animatedValue });
  }

  render() {
    const { children, style, navigation, ...rest } = this.props;
    return (
      <AnimatedKeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        style={[{ flex: 1 }, style]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedValue } } }])}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        {...rest}
      >
        {children}
      </AnimatedKeyboardAwareScrollView>
    );
  }
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
};

Container.defaultProps = {
  bgColor: '#fff',
  style: {},
};

export default withNavigation(Container);
