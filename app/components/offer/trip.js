import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import GooglePlace from '@components/googlePlace';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';

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
      start: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      isReturnTrip: false,
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
      isReturning: false,
    };
  }

  componentWillMount() {
    const { start, end, isReturnTrip } = this.props;
    this.setState({ start, end, isReturnTrip });
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

  handleReturnChange = (isReturning) => {
    this.setState({ isReturning });
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
            placeholder={trans('trip.place')}
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
    const { isOffer } = this.props;
    const { start: StateStart, end: StateEnd, isReturning, isReturnTrip } = this.state;
    return (
      <View>
        <Text style={styles.title}> {trans('trip.trip')}</Text>
        <Text style={styles.label}>{trans('global.from')}</Text>
        <GooglePlace
          placeholder={trans('trip.start_here')}
          currentLocation={!this.state.isReturnTrip}
          defaultValue={StateStart}
          onChangeText={start => this.setState({ start })}
        />
        <Text style={styles.label}>{trans('global.to')}</Text>
        <GooglePlace
          placeholder={trans('global.destination')}
          defaultValue={StateEnd}
          onChangeText={end => this.setState({ end })}
        >
          <TouchableOpacity onPress={this.switchLocation} style={styles.inputIconWrapper}>
            <Image source={require('@icons/icon_switcher.png')} style={styles.inputIcon} />
          </TouchableOpacity>
        </GooglePlace>
        <View style={styles.destinations}>
          <TouchableOpacity>
            <Text style={styles.option}>{trans('global.anywhere')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>{trans('global.south')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>{trans('global.north')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>{trans('global.west')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>{trans('global.east')}</Text>
          </TouchableOpacity>
        </View>
        {
          isOffer &&
          <View style={styles.stops}>
            <View style={styles.addStop}>
              <TouchableOpacity onPress={this.addStops}>
                <Image source={require('@icons/icon_add_stop.png')} style={styles.addStopIcon} />
              </TouchableOpacity>
              <Text style={styles.stopsLabel}>
                {trans('trip.stops_along_the_way')}:
              </Text>
            </View>
            <View>
              {this.renderStops()}
              <Text style={styles.stopsInfo}>
                {trans('trip.add_many_stops')}
              </Text>
            </View>
          </View>
        }

        {!isReturnTrip &&
          <View style={styles.verticalDivider} >
            <Image source={require('@icons/icon_return.png')} style={styles.returnIcon} />
            <Text style={styles.title}>{trans('trip.are_you_making_return')}</Text>
            <Text style={styles.returnInfo}>
              {trans('trip.if_select')}
              <Text style={styles.bold}> {trans('trip.yes')} </Text>
              {trans('trip.you_will_get_to_do_a_new_card_for_return')}
            </Text>
            <View style={styles.radioRow}>
              <View style={styles.radioWrapper}>
                <TouchableWithoutFeedback
                  onPress={() => this.handleReturnChange(true)}
                >
                  <View style={[styles.radio, { backgroundColor: isReturning ? '#1db0ed' : '#ffffff' }]} />
                </TouchableWithoutFeedback>
                <Text style={styles.radioLabel}>{trans('trip.yes_exclamation')}</Text>
              </View>
              <View style={styles.radioWrapper}>
                <TouchableWithoutFeedback
                  onPress={() => this.handleReturnChange(false)}
                >
                  <View style={[styles.radio, { backgroundColor: isReturning ? '#ffffff' : '#1db0ed' }]} />
                </TouchableWithoutFeedback>
                <Text style={styles.radioLabel}>{trans('trip.not_this_time')}</Text>
              </View>
            </View>
          </View>
        }

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
  start: PropTypes.shape({
    name: PropTypes.string,
    countryCode: PropTypes.string,
    coordinates: PropTypes.array,
  }).isRequired,
  end: PropTypes.shape({
    name: PropTypes.string,
    countryCode: PropTypes.string,
    coordinates: PropTypes.array,
  }).isRequired,
  isReturnTrip: PropTypes.bool.isRequired,
  isOffer: PropTypes.bool,
};

Trip.defaultProps = {
  isOffer: false,
};

export default Trip;
