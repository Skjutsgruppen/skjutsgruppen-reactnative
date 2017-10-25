import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import GooglePlace from '@components/googlePlace';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.blue,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    color: Colors.text.gray,
    marginBottom: 6,
    marginHorizontal: 24,
    marginTop: 12,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background.fullWhite,
    paddingRight: 24,
  },
  inputIconWrapper: {
    height: 48,
    width: 18,
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
    backgroundColor: Colors.background.fullWhite,
  },
  destinations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  option: {
    paddingHorizontal: 10,
    fontSize: 11,
    lineHeight: 20,
    fontWeight: 'bold',
    backgroundColor: Colors.background.darkCyan,
    color: Colors.text.white,
  },
  button: {
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
  },
  stopsLabel: {
    color: Colors.text.darkGray,
    lineHeight: 18,
  },
  stopsInfo: {
    marginTop: 4,
    marginLeft: 26,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.text.darkGray,
  },
  verticalDivider: {
    borderBottomColor: Colors.border.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  returnIcon: {
    width: 60,
    height: 48,
    resizeMode: 'contain',
    marginHorizontal: 24,
    marginTop: 24,
    alignSelf: 'center',
  },
  returnInfo: {
    marginBottom: 8,
    marginHorizontal: 36,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.text.gray,
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
    borderRadius: 20,
    borderWidth: 8,
    borderColor: Colors.border.white,
  },
  radioLabel: {
    fontWeight: 'bold',
    color: Colors.text.gray,
    marginTop: 6,
  },
});

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {},
      end: {},
      stops: [{}],
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
    let j = 0;

    return stops.map((s, i) => {
      j += 1;
      return (
        <View key={j} style={styles.place}>
          <Image source={require('@icons/icon_stops.png')} style={styles.stopIcon} />
          <GooglePlace
            placeholder="Place"
            onChangeText={stop => this.setStops(i, stop)}
          />
          {i > 1 ? (<TouchableWithoutFeedback onPress={() => this.removeStop(i)}>
            <View style={styles.removeStopIcon}><Text style={styles.minusText}>-</Text></View>
          </TouchableWithoutFeedback>) : null}
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.title}> Trip</Text>
        <Text style={styles.label}>From</Text>
        <View style={styles.inputWrapper}>
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
          <TouchableOpacity style={styles.inputIconWrapper}>
            <Image source={require('@icons/icon_location.png')} style={styles.inputIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>To</Text>
        <View style={styles.inputWrapper}>
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
          <TouchableOpacity style={styles.inputIconWrapper}>
            <Image source={require('@icons/icon_switcher.png')} style={styles.inputIcon} />
          </TouchableOpacity>
        </View>
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
              You can add as many stops as you want as long as you would like to
              pick up people there.
            </Text>
          </View>
        </View>
        <View style={styles.verticalDivider} />
        <Image source={require('@icons/icon_return.png')} style={styles.returnIcon} />
        <Text style={styles.title}>Are You making a return ride?</Text>
        <Text style={styles.returnInfo}>
          If select
          <Text style={styles.bold}> yes </Text>
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
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.button}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

Trip.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Trip;
