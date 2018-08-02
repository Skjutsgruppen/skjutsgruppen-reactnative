import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions, PanResponder, LayoutAnimation, UIManager } from 'react-native';

const LayoutAnimationconfigInner = {
  duration: parseInt(300, 0),
  update: {
    type: 'easeInEaseOut',
  },
  useNativeDriver: true,
};

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: 16,
    left: 16,
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#f00',
  },
  feed: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: '#f0f',
  },
});

class Test extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dy } = gestureState;
        return this.state.yPos <= 0 && dy > 4;
      },

      onPanResponderRelease: (evt, { dy, vy }) => {
        let duration = 300;
        if (dy < 30) {
          duration = Math.abs(dy * 10);
        }
        if (dy > 150) {
          if (vy <= 0) {
            this.setFeedView(duration);
          } else {
            this.setMapView(duration);
          }
        }

        if (vy > 0.75) {
          this.setMapView(duration);
        } else {
          this.setFeedView(duration);
        }
      },

      onPanResponderTerminate: (evt, { dy, vy }) => {
        let duration = 300;
        if (dy < 150) {
          duration = Math.abs(dy * 2);
        }
        if (dy > 150) {
          if (vy <= 0) {
            this.setFeedView(duration);
          } else {
            this.setMapView(duration);
          }
        }

        if (vy > 0.75) {
          this.setMapView(duration);
        } else {
          this.setFeedView(duration);
        }
      },

      onPanResponderMove: (event, { dy }) => {
        this.setFeedWrapperOffset(dy);
      },
    });
  }

  state = {
    yPos: -3,
  }

  setMapView = () => {
    LayoutAnimation.configureNext(LayoutAnimationconfigInner);
  }

  setFeedView = () => {
    LayoutAnimation.configureNext(LayoutAnimationconfigInner);
  }

  setFeedWrapperOffset = (top) => {
    this.feedWraper.setNativeProps({ top });
  }

  render() {
    return (
      <View
        {...this.panResponder.panHandlers}
        style={{ flex: 1 }}
      >
        <View style={styles.back} />
        <View
          ref={(ref) => { this.feedWraper = ref; }}
          style={styles.feed}
        >
          <Text>Test</Text>
        </View>
      </View>
    );
  }
}

export default Test;
