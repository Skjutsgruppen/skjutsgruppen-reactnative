import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image } from 'react-native';
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
    width: 16,
    resizeMode: 'contain',
    marginRight: 10,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 12,
  },
  stopIcon: {
    width: 16,
    resizeMode: 'contain',
    marginRight: 10,
  },
  stopsLabel: {
    color: '#777777',
    lineHeight: 18,
  },
  stopsInfo: {
    marginBottom: 8,
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
      start: {},
      end: {},
      stops: [],
      stopsCount: 1,
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

  renderStops() {
    let { stops } = this.state;
    stops = stops.length > 0 ? stops : [{}];
    let j = 1;

    return stops.map((s, i) => {
      j += 1;
      return (
        <View key={j} style={styles.place}>
          <Image source={require('@icons/icon_stops.png')} style={styles.stopIcon} />
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
        <Text style={styles.title}>Specific stretch</Text>
        <Text style={styles.label}>From</Text>
        <View>
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
            style={{ marginBottom: 32 }}
          />
        </View>
        <Text style={styles.label}>To</Text>
        <View>
          <GooglePlace
            placeholder="Start here"
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
        </View>
        <View style={styles.stops}>
          <View style={styles.addStop}>
            <TouchableWithoutFeedback onPress={this.addStops}>
              <Image source={require('@icons/icon_add_stop.png')} style={styles.addStopIcon} />
            </TouchableWithoutFeedback>
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
