import React, { PureComponent } from 'react';
import { StyleSheet, View, ViewPropTypes, Animated, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.background.lightGray,
    marginTop: 20,
    borderRadius: 2,
  },
  bar: {
    height: 4,
    width: '0%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
});

class ProgressBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      widthAnim: new Animated.Value(0),
    };

    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.widthAnim,
      {
        toValue: 1,
        duration: 350,
        easing: Easing.easeInEaseOut,
        delay: 200,
      },
    ).start();
  }

  componentWillUpdate() {
    const config = {
      duration: 350,
      update: {
        type: 'easeInEaseOut',
      },
    };
    LayoutAnimation.configureNext(config);
  }

  render() {
    const { defaultAmount, amount, style, color, changesColor } = this.props;
    let progressColor = color;
    if (changesColor) {
      if (amount >= 100) {
        progressColor = Colors.background.yellowGreen;
      }
    }

    let width = defaultAmount ? `${defaultAmount}%` : '0%';

    width = this.state.widthAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [width, `${amount}%`],
    });

    return (
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.bar, { width, backgroundColor: progressColor }]} />
      </View>
    );
  }
}

ProgressBar.propTypes = {
  defaultAmount: PropTypes.number,
  amount: PropTypes.number.isRequired,
  style: ViewPropTypes.style,
  color: PropTypes.string,
  changesColor: PropTypes.bool,
};

ProgressBar.defaultProps = {
  defaultAmount: null,
  style: {},
  color: Colors.background.pink,
  changesColor: true,
};

export default ProgressBar;
