import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

let TouchableComponent;

if (Platform.OS === 'android') {
  TouchableComponent =
    Platform.Version <= 20 ? TouchableOpacity : TouchableNativeFeedback;
} else {
  TouchableComponent = TouchableOpacity;
}

if (TouchableComponent !== TouchableNativeFeedback) {
  TouchableComponent.SelectableBackground = () => ({});
  TouchableComponent.SelectableBackgroundBorderless = () => ({});
  TouchableComponent.canUseNativeForeground = () => false;
}

class TouchableHightlight extends React.Component {
  static SelectableBackground = TouchableComponent.SelectableBackground;
  static SelectableBackgroundBorderless = TouchableComponent.SelectableBackgroundBorderless;
  static Ripple = TouchableComponent.Ripple;
  static canUseNativeForeground = TouchableComponent.canUseNativeForeground;

  render() {
    const {
      children,
      style,
      foreground,
      ...props
    } = this.props;

    let useForeground = false;

    // Even though it works for TouchableWithoutFeedback and
    // TouchableNativeFeedback with this component, we want
    // the API to be the same for all components so we require
    // exactly one direct child for every touchable type.
    const childElement = React.Children.only(children);

    if (TouchableComponent === TouchableNativeFeedback) {
      useForeground =
        foreground && TouchableNativeFeedback.canUseNativeForeground();

      return (
        <TouchableComponent
          {...props}
          useForeground={useForeground}
        >
          <View style={style}>
            {childElement}
          </View>
        </TouchableComponent>
      );
    }

    if (TouchableComponent === TouchableWithoutFeedback) {
      return (
        <TouchableWithoutFeedback {...props}>
          <View style={style}>
            {childElement}
          </View>
        </TouchableWithoutFeedback>
      );
    }

    const TouchableFallback = this.props.fallback || TouchableComponent;
    return (
      <TouchableFallback {...props} style={style}>
        {children}
      </TouchableFallback>
    );
  }
}
TouchableHightlight.propTypes = {
  children: PropTypes.node.isRequired,
  style: View.propTypes.style,
  foreground: PropTypes.bool,
  fallback: PropTypes.string,
};

TouchableHightlight.defaultProps = {
  style: {},
  foreground: true,
  fallback: '',
};

export default TouchableHightlight;
