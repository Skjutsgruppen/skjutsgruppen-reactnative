import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import PlaceInput from '@components/search/place/placeInput';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import SectionLabel from '@components/add/sectionLabel';
import DragIcon from '@assets/icons/ic_drag.png';
import AddIcon from '@assets/icons/ic_add_pink.png';
import CrossIcon from '@assets/icons/ic_cross_pink.png';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: '5%',
  },
  stops: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
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
  indexText: {
    color: Colors.text.pink,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
    marginTop: 20,
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
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      end: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      stops: [{
        name: '',
        countryCode: '',
        coordinates: [],
      }],
      stopsCount: 1,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    let stops = [];

    if (state.stops.length > 0) {
      stops = state.stops.filter(k => k.coordinates && k.coordinates.length);
    }

    onNext({ ...state, ...{ stops } });
  };

  onChangeText = (i, stop) => {
    this.setStops(i, stop, this.state.stopsCount);
  };

  setStops = (count, stop, stopsCount) => {
    const { stops } = this.state;
    stops[count] = stop;

    this.setState({ stops, stopsCount });
  };

  removeStop = (count) => {
    const { stops } = this.state;

    delete stops[count];

    this.setState({ stops, stopsCount: this.state.stopsCount - 1 });
  }

  addStops = () => {
    this.setStops(this.state.stopsCount, {}, this.state.stopsCount + 1);
  };

  switchLocation = () => {
    const { start, end } = this.state;
    this.setState({ start: end, end: start });
  };

  renderStops() {
    const { stops } = this.state;
    let j = 0;

    return stops.map((s, i) => {
      j += 1;
      return (
        <View key={j} style={styles.stop}>
          <View style={styles.iconWrapper}>
            <Image source={DragIcon} style={[styles.icon, styles.drag]} />
          </View>
          <View style={styles.index}>
            <Text style={styles.indexText}>{j}</Text>
          </View>
          <PlaceInput
            placeholder="Place"
            height={60}
            inputStyle={{ paddingLeft: 68 }}
            defaultValue={this.state.stops[i]}
            onChangeText={(stop) => { this.onChangeText(i, stop); }}
          />
          <TouchableOpacity
            onPress={() => this.removeStop(i)}
            style={[styles.iconWrapper, styles.remove]}
          >
            <Image source={CrossIcon} />
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <SectionLabel label="From" />
        <PlaceInput
          placeholder="Start here"
          currentLocation
          defaultValue={this.state.start}
          onChangeText={start => this.setState({ start })}
          style={{ marginBottom: 32 }}
        />
        <SectionLabel label="Stops In" />
        <View style={styles.stops}>
          {this.renderStops()}
          <View style={styles.addStopWrapper}>
            <View style={styles.iconWrapper} />
            <TouchableHighlight onPress={this.addStops} style={{ flex: 1 }}>
              <View style={styles.addStop}>
                <Image source={AddIcon} style={styles.addStopIcon} />
                <Text>Add stop</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.iconWrapper} />
          </View>
        </View>
        <SectionLabel label="To" />
        <PlaceInput
          placeholder="Destination"
          defaultValue={this.state.end}
          onChangeText={end => this.setState({ end })}
        />
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

Route.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Route;
