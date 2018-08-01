import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, PanResponder, TouchableWithoutFeedback } from 'react-native';
import { Heading } from '@components/utils/texts';
import PlaceInput from '@components/search/place/placeInput';
import CrossIcon from '@assets/icons/ic_cross_pink.png';
import DragIcon from '@assets/icons/ic_drag.png';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stops: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  iconWrapper: {
    height: 60,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  index: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 56,
    zIndex: 2,
  },
});

class DraggableStop extends Component {
  constructor() {
    super();
    this.panView = null;
    this.panResponder = this.createPanResponder();
    this.state = { place: {} };
  }

  componentWillMount() {
    this.setState({ place: this.props.place });
  }

  componentWillReceiveProps({ isBeingDragged }) {
    if (isBeingDragged) {
      this.panView.setNativeProps({ opacity: 0 });
    } else {
      this.panView.setNativeProps({ opacity: 1 });
    }
  }

  onPlaceChange = (stop) => {
    this.setState({ place: stop.place });
    this.props.onInputChange(this.props.index, stop, this.props.title);
  }

  createPanResponder = () => PanResponder.create({
    onMoveShouldSetPanResponder: (event, gestureState) => {
      const { numberActiveTouches, dx, dy } = gestureState;
      const { place } = this.state;

      if (place && !place.name) {
        return false;
      }

      if (numberActiveTouches !== 1) {
        return false;
      }

      if (dx === 0 && dy === 0) {
        return false;
      }

      return this.props.onMoveShouldSetPanResponder(event, this.props.index);
    },
    onPanResponderGrant: (event, gestureState) =>
      this.props.onPanResponderGrant(event, gestureState, this.props.index),
    onPanResponderMove: (event, gestureState) =>
      this.props.onPanResponderMove(event, gestureState, this.props.index),
    onPanResponderRelease: (event, gestureState) =>
      this.props.onPanResponderEnd(event, gestureState, this.props.index),
    onPanResponderTerminate: (event, gestureState) =>
      this.props.onPanResponderEnd(event, gestureState, this.props.index),
  });

  render() {
    const { number } = this.props;
    const { place } = this.state;

    return (
      <View
        ref={(ref) => { this.panView = ref; }}
        item={place}
        style={styles.stop}
      >
        <View
          style={styles.iconWrapper}
          {...this.panResponder.panHandlers}
        >
          <TouchableWithoutFeedback>
            <Image source={DragIcon} style={[styles.icon, styles.drag]} />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.index}>
          <Heading size={16} color={Colors.text.pink} fontVariation="bold" centered>{number}</Heading>
        </View>
        <PlaceInput
          placeholder="Place"
          currentLocation={false}
          wrapperStyle={{ flex: 1 }}
          height={60}
          defaultValue={place}
          inputStyle={{ paddingLeft: 68 }}
          label="Stop"
          onChangeText={stop => this.onPlaceChange(stop)}
        />
        <TouchableOpacity
          onPress={() => this.props.removeStop(this.props.index)}
          style={[styles.iconWrapper, styles.remove]}
        >
          <Image source={CrossIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

DraggableStop.propTypes = {
  removeStop: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onMoveShouldSetPanResponder: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isBeingDragged: PropTypes.bool.isRequired,
  onPanResponderGrant: PropTypes.func.isRequired,
  onPanResponderMove: PropTypes.func.isRequired,
  onPanResponderEnd: PropTypes.func.isRequired,
  number: PropTypes.number.isRequired,
};

export default DraggableStop;
