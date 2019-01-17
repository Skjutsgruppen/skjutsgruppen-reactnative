import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { getDirectionURL } from '@helpers/location';
import { RoundedButton } from '@components/common';
import PlaceInput from '@components/search/place/placeInput';
import Colors from '@theme/colors';
import Radio from '@components/add/radio';
import SectionLabel from '@components/add/sectionLabel';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

import Stops from '@components/offer/stops';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: '2%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.pink,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
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
  returnSection: {
    paddingTop: 24,
  },
  returnInfo: {
    marginVertical: 12,
    marginHorizontal: 20,
    color: Colors.text.gray,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  routeError: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(255,0,0,0.05)',
    borderColor: 'rgba(255,0,0,0.2)',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  errorText: {
    color: 'rgba(0,0,0,0.45)',
    fontSize: 14,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Route extends PureComponent {
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
      isReturning: true,
      hideReturnTripOption: false,
      currentLocationSelected: '',
      directionFrom: '',
      directionTo: '',
      error: null,
    };
  }

  componentWillMount() {
    const { defaultValue, hideReturnTripOption } = this.props;
    const { start, end, directionFrom, directionTo, currentLocationSelected = '', isReturning } = defaultValue;

    let { stops } = defaultValue;
    let stopsCount = stops.length;

    if (stopsCount === 0) {
      stopsCount = 1;
      stops = this.state.stops;
    }

    this.setState({
      start,
      end,
      directionFrom,
      directionTo,
      stops,
      stopsCount,
      currentLocationSelected,
      hideReturnTripOption,
      isReturning,
    });
  }

  onNext = async () => {
    this.setState({ error: null });
    const state = this.state;

    const { start, end, directionFrom, directionTo } = state;

    if ((directionFrom && directionFrom !== '') || (directionTo && directionTo !== '')) {
      this.proceedWithRouteInfo();
      return;
    }

    try {
      const response = await fetch(getDirectionURL(start, end));
      const direction = await response.json();
      if (direction.status === 'OK') {
        this.proceedWithRouteInfo();
      } else if (direction.status === 'ZERO_RESULTS') {
        this.setState({ error: trans('add.no_route_found') });
      } else {
        this.setState({ error: trans('add.try_again') });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  onChangeText = (i, { place }) => {
    this.setStops(i, place, this.state.stopsCount);
  };

  onStopChange = (stops) => {
    this.props.defaultValue.stops = stops;
    this.setState({ stops, stopsCount: stops.length });
  };

  setEndPlace = ({ place, source, direction }) => {
    let { currentLocationSelected } = this.state;

    if (source === 'currentLocation') {
      currentLocationSelected = 'end';
    } else if (currentLocationSelected === 'end' && source !== 'currentLocation') {
      currentLocationSelected = '';
    }

    currentLocationSelected = source === 'currentLocation' ? 'end' : currentLocationSelected;
    this.setState({ end: place, currentLocationSelected, directionTo: direction });
  }

  setStartPlace = ({ place, source, direction }) => {
    let { currentLocationSelected } = this.state;
    currentLocationSelected = source === 'currentLocation' ? 'start' : currentLocationSelected;

    this.setState({ start: place, directionFrom: direction, currentLocationSelected });
  }

  setStops = (count, stop, stopsCount) => {
    const { stops } = this.state;
    stops[count] = stop;
    this.setState({ stops, stopsCount });
  };


  proceedWithRouteInfo = () => {
    const { onNext } = this.props;
    const state = this.state;
    let stops = [];
    if (state.stops.length > 0) {
      stops = state.stops.filter(k => k.coordinates && k.coordinates.length)
        .map(({ name, countryCode, coordinates }) => ({ name, countryCode, coordinates }));
    }


    const value = { ...state, ...{ stops } };
    onNext(value);
  }


  handleReturnChange = (isReturning) => {
    this.setState({ isReturning });
  };

  currentLocation = (type) => {
    const { currentLocationSelected } = this.state;
    return (type === currentLocationSelected || currentLocationSelected === '');
  }

  renderStops() {
    const { stops } = this.state;

    return (
      <Stops
        stops={stops}
        onStopChange={this.onStopChange}
        scrollContainer={this.props.scrollContainer}
      />
    );
  }

  render() {
    const { isOffer, buttonLabel } = this.props;
    const {
      start,
      end,
      isReturning,
      hideReturnTripOption,
      directionFrom,
      directionTo,
      error,
    } = this.state;

    return (
      <View style={styles.wrapper}>
        <SectionLabel label={trans('add.from')} color={isOffer ? Colors.text.pink : Colors.text.blue} />
        <PlaceInput
          placeholder={trans('add.start_here')}
          label={trans('add.from')}
          height={80}
          inputStyle={{ paddingLeft: 20 }}
          currentLocation={this.currentLocation('start')}
          defaultValue={start}
          defaultDirection={directionFrom}
          onChangeText={this.setStartPlace}
          direction={!directionTo}
        />
        {
          isOffer &&
          <View>
            <SectionLabel label={trans('add.stops_in')} color={isOffer ? Colors.text.pink : Colors.text.blue} />
            <View style={styles.stops}>
              {this.renderStops()}
            </View>
          </View>
        }
        <SectionLabel label={trans('add.to')} color={isOffer ? Colors.text.pink : Colors.text.blue} />
        <PlaceInput
          placeholder={trans('add.destination')}
          label={trans('add.to')}
          height={80}
          inputStyle={{ paddingLeft: 20 }}
          currentLocation={this.currentLocation('end')}
          defaultValue={end}
          defaultDirection={directionTo}
          onChangeText={this.setEndPlace}
          direction={!directionFrom}
        />
        {!hideReturnTripOption &&
          <View style={styles.returnSection}>
            <SectionLabel label={trans('add.are_you_making_a_return_ride')} color={isOffer ? Colors.text.pink : Colors.text.blue} />
            <View style={styles.radioRow}>
              <Radio
                active={isReturning}
                label={trans('add.yes')}
                onPress={() => this.handleReturnChange(true)}
                color={isOffer ? 'pink' : 'blue'}
              />
              <Radio
                active={!isReturning}
                label={trans('add.no')}
                onPress={() => this.handleReturnChange(false)}
                color={isOffer ? 'pink' : 'blue'}
              />
            </View>
            <AppText size={15} style={styles.returnInfo}>{trans('add.if_yes_you_will_get_to_make_new_card')}</AppText>
          </View>
        }
        {
          error && error !== '' && (
            <View style={styles.routeError}>
              <AppText style={styles.errorText}>
                {error}
              </AppText>
            </View>
          )
        }
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {buttonLabel}
        </RoundedButton>
      </View>
    );
  }
}

Route.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
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
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        countryCode: PropTypes.string,
        coordinates: PropTypes.array,
      })),
  }).isRequired,
  hideReturnTripOption: PropTypes.bool.isRequired,
  isOffer: PropTypes.bool,
  buttonLabel: PropTypes.string,
};

Route.defaultProps = {
  isOffer: false,
  buttonLabel: trans('global.next'),
};

export default Route;
