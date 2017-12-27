import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import GooglePlace from '@components/googlePlace';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',

  },
  label: {
    color: '#999999',
    marginBottom: 6,
    marginTop: 12,
    marginHorizontal: 24,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingRight: 0,
  },
  inputIconWrapper: {
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  stops: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  addStop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 12,
  },
  addStopIcon: {
    width: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    marginTop: 12,
  },
  stopIcon: {
    width: 16,
    height: 48,
    resizeMode: 'contain',
    marginRight: 10,
  },
  removeStopIcon: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.blue,
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 12,
    marginTop: 12,
  },
  minusText: {
    color: Colors.text.white,
    fontSize: 28,
    lineHeight: 28,
    paddingBottom: 7,
  },
  stopsLabel: {
    color: '#777777',
    lineHeight: 18,
  },
  stopsInfo: {
    marginTop: 4,
    marginLeft: 26,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
  },
  bold: {
    fontWeight: 'bold',
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
        <View key={j} style={styles.place}>
          <Image source={require('@icons/icon_stops.png')} style={styles.stopIcon} />
          <GooglePlace
            placeholder="Place"
            defaultValue={this.state.stops[i]}
            onChangeText={(stop) => { this.onChangeText(i, stop); }}
          />
          {j > 1 ? (<TouchableOpacity onPress={() => this.removeStop(i)}>
            <View style={styles.removeStopIcon}><Text style={styles.minusText}>-</Text></View>
          </TouchableOpacity>) : null}
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>Specific stretch</Text>
        <Text style={styles.label}>From</Text>
        <GooglePlace
          placeholder="Start here"
          currentLocation
          defaultValue={this.state.start}
          onChangeText={start => this.setState({ start })}
          style={{ marginBottom: 32 }}
        />
        <Text style={styles.label}>To</Text>
        <View style={[styles.inputWrapper, { zIndex: 8 }]}>
          <GooglePlace
            placeholder="Destination"
            defaultValue={this.state.end}
            onChangeText={end => this.setState({ end })}
          >
            <TouchableOpacity onPress={this.switchLocation} style={styles.inputIconWrapper}>
              <Image source={require('@icons/icon_switcher.png')} style={styles.inputIcon} />
            </TouchableOpacity>
          </GooglePlace>
        </View>
        <View style={styles.stops}>
          <View style={styles.addStop}>
            <TouchableOpacity onPress={this.addStops}>
              <Image source={require('@icons/icon_add_stop.png')} style={styles.addStopIcon} />
            </TouchableOpacity>
            <Text style={styles.stopsLabel}>
              Stops along the way:
            </Text>
          </View>
          <View>
            {this.renderStops()}
            <Text style={styles.stopsInfo}>
              You can add as many stops as you want as long as
              you would like to pick up people there.
            </Text>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            onPress={this.onNext}
            bgColor={Colors.background.darkCyan}
          >
            Next
          </CustomButton>
        </View>
      </View>
    );
  }
}

Route.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Route;
