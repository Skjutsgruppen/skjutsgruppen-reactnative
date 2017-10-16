import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import GooglePlace from '@components/googlePlace';

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
    marginHorizontal: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  destinations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  option: {
    paddingHorizontal: 6,
    fontSize: 11,
    lineHeight: 20,
    fontWeight: 'bold',
    backgroundColor: '#38ad9e',
    color: '#ffffff',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  stops: {
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderColor: '#dddddd',
    marginBottom: 24,
  },
  stopsLabel: {
    marginBottom: 8,
    color: '#777777',
  },
  stopsInfo: {
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
  },
  returnInfo: {
    marginBottom: 8,
    marginHorizontal: 36,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
  },
  radioWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: 40,
    width: 40,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: '#ffffff',
  },
  radioLabel: {
    fontWeight: 'bold',
    color: '#777777',
    marginTop: 4,
  },
});

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {},
      end: {},
      stops: [],
      stopsCount: 1,
      isReturning: false,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    const stops = [];
    state.stops.forEach(k => stops.push(k));
    state.stops = stops;
    onNext(state);
  };

  setStops = (count, stop) => {
    const { stops } = this.state;
    stops[count] = {
      name: stop.name,
      countryCode: stop.countryCode,
      coordinates: [stop.lat, stop.lng],
    };

    this.setState({ stops });
  };

  removeStop = (count) => {
    const { stops } = this.state;

    delete stops[count];

    this.setState({ stops, stopsCount: this.state.stopsCount - 1 });
  }

  addStops = () => {
    this.setState({ stopsCount: this.state.stopsCount + 1 }, () => {
      this.setStops(this.state.stopsCount, {});
    });
  };

  handleReturnChange = (isReturning) => {
    this.setState({ isReturning });
  };

  renderStops() {
    let { stops } = this.state;
    stops = stops.length > 0 ? stops : [{}];
    let j = 1;

    return stops.map((s, i) => {
      j += 1;
      return (
        <View key={j}>
          <GooglePlace
            placeholder="Place"
            onChangeText={stop => this.setStops(i, stop)}
          />
          {i > 0 ? (<TouchableWithoutFeedback onPress={() => this.removeStop(i)}>
            <View><Text>-</Text></View>
          </TouchableWithoutFeedback>) : null}
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.title}> Trip</Text>
        <View>
          <Text style={styles.label}>From</Text>
          <GooglePlace
            placeholder="Start here"
            onChangeText={
              start => this.setState({
                start: {
                  name: start.name,
                  countryCode: start.countryCode,
                  coordinates: [start.lat, start.lng],
                },
              })
            }
          />
        </View>
        <View>
          <Text style={styles.label}>To</Text>
          <GooglePlace
            placeholder="Destination"
            onChangeText={
              end => this.setState({
                end: {
                  name: end.name,
                  countryCode: end.countryCode,
                  coordinates: [end.lat, end.lng],
                },
              })
            }
          />
          <View style={styles.destinations}>
            <TouchableOpacity>
              <Text style={styles.option}>Anywhere</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.option}>South</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.option}>North</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.option}>West</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.option}>East</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.stops}>
          <View>
            <TouchableWithoutFeedback onPress={this.addStops}>
              <View><Text>+</Text></View>
            </TouchableWithoutFeedback>
            <Text style={styles.stopsLabel}>
              Stops along the way:
            </Text>
          </View>
          <View>
            {this.renderStops()}
            <Text style={styles.stopsInfo}>
              You can add as many stops as you want as long as you would like to
              pick up people there.
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.title}>Are You making a return ride?</Text>
          <Text style={styles.returnInfo}>
            If select
            <Text style={styles.bold}>yes</Text>
            you will get to do a new card for your return ride after you are done
            filling in this card. The cards will be connected to each other.
          </Text>
          <View style={styles.radioRow}>
            <View style={styles.radioWrapper}>
              <TouchableWithoutFeedback
                onPress={() => this.handleReturnChange(true)}
              >
                <View style={[styles.radio, { backgroundColor: this.state.isReturning ? '#1db0ed' : '#ffffff' }]} />
              </TouchableWithoutFeedback>
              <Text style={styles.radioLabel}>Yes!</Text>
            </View>
            <View style={styles.radioWrapper}>
              <TouchableWithoutFeedback
                onPress={() => this.handleReturnChange(false)}
              >
                <View style={[styles.radio, { backgroundColor: this.state.isReturning ? '#ffffff' : '#1db0ed' }]} />
              </TouchableWithoutFeedback>
              <Text style={styles.radioLabel}>Not this time</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title="Next"
            corlor="#38ad9e"
          />
        </View>
      </View>
    );
  }
}

Trip.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Trip;
