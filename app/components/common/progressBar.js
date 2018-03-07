import React, { PureComponent } from 'react';
import { StyleSheet, View, ViewPropTypes, LayoutAnimation, Platform, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.background.lightGray,
    marginTop: 20,
  },
  bar: {
    height: 4,
  },
});

class ProgressBar extends PureComponent {
  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }

  componentWillUpdate() {
    const config = {
      duration: 250,
      update: {
        type: 'easeInEaseOut',
      },
    };
    LayoutAnimation.configureNext(config);
  }

  render() {
    const { amount, style, color, changesColor } = this.props;
    let progressColor = color;
    if (changesColor) {
      if (amount >= 100) {
        progressColor = Colors.background.yellowGreen;
      }
    }

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.bar, { width: `${amount}%`, backgroundColor: progressColor }]} />
      </View>
    );
  }
}

ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  style: ViewPropTypes.style,
  color: PropTypes.string,
  changesColor: PropTypes.bool,
};

ProgressBar.defaultProps = {
  style: {},
  color: Colors.background.pink,
  changesColor: true,
};

export default ProgressBar;
