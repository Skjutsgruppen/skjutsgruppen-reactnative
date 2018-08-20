import React, { Component } from 'react';
import { View, Platform, UIManager, LayoutAnimation, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DraggableStop from '@components/offer/draggableStop';
import PlaceInput from '@components/search/place/placeInput';
import _pullAt from 'lodash/pullAt';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';

import AddIcon from '@assets/icons/ic_add_pink.png';

const styles = StyleSheet.create({
  iconWrapper: {
    height: 60,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    maxWidth: '100%',
    resizeMode: 'contain',
  },
  addStopWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addStop: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  addStopIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 15,
    marginRight: 23,
  },
});

const STOP_HEIGHT = 80;
const DRAGABLE_OFFSET = 30;

class Stops extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      itemBeingDragged: null,
    };
    this.scrollView = null;
    this.targetIndex = null;
    this.draggedItem = null;
    this.previousIndex = null;
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }

  componentWillMount() {
    const { stops } = this.props;
    this.setState({ items: stops.map((stop, index) => ({ ...stop, ...{ id: index, title: stop.name + index.toString() } })) });
  }

  onMoveShouldSetPanResponder = (event, index) => {
    const { items } = this.state;
    const { scrollContainer } = this.props;

    if (items.length > 1 && index >= 0) {
      this.previousIndex = index;
      this.setState(
        {
          itemBeingDragged: { ...items[index], ...{ top: index * STOP_HEIGHT, index } },
        },
      );

      if (scrollContainer) {
        this.props.scrollContainer.setNativeProps({ scrollEnabled: false });
      }

      return true;
    }

    return false;
  }

  onPanResponderGrant = () => { }

  onPanResponderMove = async (event, gestureState, index) => {
    const { dy } = gestureState;
    const draggedItem = this.state.itemBeingDragged;
    this.draggedItem.setNativeProps({ top: (this.previousIndex * STOP_HEIGHT) + dy });

    const targetIndex = Math.floor(
      ((this.previousIndex * STOP_HEIGHT) + dy + DRAGABLE_OFFSET) / STOP_HEIGHT,
    );
    const target = this.state.items[targetIndex];

    // console.log(targetIndex, "target Index");
    // console.log(index, "current index");
    // console.log(targetIndex >= 0
    //   && targetIndex !== index
    //   && this.targetIndex !== targetIndex
    //   && target && target.name, "condition for swap");

    if (targetIndex >= 0
      && targetIndex !== index
      && this.targetIndex !== targetIndex
      && target && target.name
    ) {
      this.targetIndex = targetIndex;
      const original = [...this.state.items];
      const final = [];

      original.splice(draggedItem.index, 1);
      original.forEach((item) => {
        if (draggedItem.index <= targetIndex) {
          final.push(item);
          if (item.title === target.title) {
            final.push(draggedItem);
          }
        } else {
          if (item.title === target.title) {
            final.push(draggedItem);
          }
          final.push(item);
        }
      });

      const config = {
        duration: 250,
        update: {
          type: 'easeInEaseOut',
        },
      };
      LayoutAnimation.configureNext(config);
      this.setState({
        items: final,
        itemBeingDragged: { ...this.state.itemBeingDragged, ...{ index: targetIndex } },
      });
    }
  }

  onPanResponderEnd = () => {
    const { scrollContainer } = this.props;
    if (scrollContainer) {
      this.props.scrollContainer.setNativeProps({ scrollEnabled: true });
    }
    this.targetIndex = null;
    this.setState({ itemBeingDragged: null }, () => { this.props.onStopChange(this.state.items); });
  }

  onInputChange = (index, stop, title) => {
    const items = [...this.state.items];
    const { place: { coordinates, countryCode, name } } = stop;
    items[index] = { ...items[index], ...{ coordinates, countryCode, name, title } };
    this.setState({ items }, () => { this.props.onStopChange(this.state.items); });
  }

  onRemoveStop = (key) => {
    const { items } = this.state;
    _pullAt(items, key);
    this.setState({ items }, () => { this.props.onStopChange(this.state.items); });
  }

  onAddStop = () => {
    const lastItem = this.state.items[this.state.items.length - 1];
    const items = this.state.items.concat({ id: lastItem.id + 1 });
    this.setState({ items }, () => { this.props.onStopChange(this.state.items); });
  }

  renderStops = () => {
    let j = 0;

    return this.state.items.map((place, i) => {
      j += 1;
      return (
        <DraggableStop
          place={place}
          title={place.title || j.toString()}
          key={place.id}
          index={i}
          onInputChange={this.onInputChange}
          removeStop={this.onRemoveStop}
          number={j}
          onPanResponderMove={this.onPanResponderMove}
          onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
          onPanResponderGrant={this.onPanResponderGrant}
          onPanResponderEnd={this.onPanResponderEnd}
          isBeingDragged={
            this.state.itemBeingDragged ?
              this.state.itemBeingDragged.index === i :
              false
          }
        />
      );
    });
  }

  renderGhostStop() {
    const { itemBeingDragged } = this.state;
    const { name, coordinates, countryCode } = itemBeingDragged;

    return (
      <View
        style={{ position: 'absolute', top: itemBeingDragged.top, width: 360 }}
        ref={(ref) => { this.draggedItem = ref; }}
      >
        <PlaceInput
          placeholder="Place"
          currentLocation={false}
          wrapperStyle={{ flex: 1 }}
          height={60}
          defaultValue={{ name, coordinates, countryCode } || {}}
          inputStyle={{ paddingLeft: 68 }}
          label="Stop"
          onChangeText={() => { }}
        />
      </View>
    );
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        collapsable={false}
      >
        {this.renderStops()}
        {this.state.itemBeingDragged && this.renderGhostStop()}
        <View style={styles.addStopWrapper}>
          <View style={styles.iconWrapper} />
          <TouchableOpacity onPress={() => this.onAddStop()} style={{ flex: 1 }}>
            <View style={styles.addStop}>
              <Image source={AddIcon} style={styles.addStopIcon} />
              <AppText>{trans('add.add_stop')}</AppText>
            </View>
          </TouchableOpacity>
          <View style={styles.iconWrapper} />
        </View>
      </View>
    );
  }
}

Stops.propTypes = {
  scrollContainer: PropTypes.shape(),
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  ),
  onStopChange: PropTypes.func.isRequired,
};

Stops.defaultProps = {
  stops: {},
  scrollContainer: null,
};

export default Stops;
