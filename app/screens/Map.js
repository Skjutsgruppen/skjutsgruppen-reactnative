import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Loading } from '@components/common';
import { withMapTrips } from '@services/apollo/map';
import PropTypes from 'prop-types';
import { getCountryLocation, getCurrentLocation } from '@helpers/device';
import MapView from 'react-native-maps';
import Marker from '@components/map/marker';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import Navigation from '@components/map/navigation';
import { getDistanceFromLatLonInKm } from '@services/map-directions';
import { FEED_FILTER_EVERYTHING } from '@config/constant';
import Filter from '@components/feed/filter';
import moment from 'moment';

import Colors from '@theme/colors';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  lightText: {
    color: Colors.text.gray,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.15,
  },
  tryAgain: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loadingWraper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* avoid pagination and render all trips
   Totos:
    smooth marker rendering
    random markers are not showing when redenring
    multiple api call abort previous request.
*/
const DISTANCE_GAP = 1500000000;

class Map extends PureComponent {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = ({
      filterOpen: false,
      filterType: FEED_FILTER_EVERYTHING,
      region: {
        latitude: 20.989622,
        longitude: -10.3460274,
        latitudeDelta: 120,
        longitudeDelta: 120 * ASPECT_RATIO,
      },
      locationError: false,
      currentLocation: false,
      trips: [],
      error: '',
      from: 0,
      to: DISTANCE_GAP,
      loading: false,
    });
    this.region = {};
  }

  componentWillMount() {
    const { latitude, longitude } = getCountryLocation();
    let { region } = this.state;

    if (latitude && longitude) {
      region = {
        latitude,
        longitude,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      };
    }

    this.setState({ region, loading: true });
  }

  componentDidMount() {
    this.ismounted = true;
    this.getLocation();
  }

  componentWillUnmount() {
    this.ismounted = false;
  }

  onMarkerPress = (Trip) => {
    const { navigation } = this.props;
    navigation.navigate('TripDetail', { trip: Trip });
  }

  onRegionChange = async (region) => {
    const { longitude, latitude } = this.state.region;
    const distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      region.latitude,
      region.longitude,
    );

    if (distance > this.state.to) {
      this.setState(
        { from: this.state.to, to: this.state.to + DISTANCE_GAP, region, loading: false },
        this.fetchTripMap,
      );
    }

    this.region = region;
  }

  onFilterChange = (type) => {
    if (type !== this.state.filterType) {
      this.setState({ filterType: type, filterOpen: false, loading: true }, this.fetchTripMap);
    }
  }

  async getLocation() {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      if (latitude && longitude) {
        this.setState({
          currentLocation: true,
          region: {
            latitude,
            longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA,
          },
          locationError: false,
        }, this.fetchTripMap);
      } else {
        this.setState({ locationError: false }, this.fetchTripMap);
      }
    } catch (error) {
      let { locationError } = this.state;
      const { currentLocation } = this.state;

      if (!currentLocation) {
        locationError = true;
      }

      this.setState({ error, locationError }, this.fetchTripMap);
    }
  }

  getUniqueTrips = (data) => {
    let newTrips = [];
    let found = false;
    const { trips } = this.state;
    const uniqueTrips = data.filter((row) => {
      found = false;
      trips.forEach((trip) => {
        if (trip.id === row.id) {
          found = true;
        }
      });
      return !found;
    });

    newTrips = uniqueTrips.map((trip) => {
      const { startPoint, Routable, id } = trip;
      return {
        id,
        coordinate: {
          lng: startPoint[0],
          lat: startPoint[1],
        },
        trip: Routable,
      };
    });

    return trips.concat(newTrips);
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  async fetchTripMap() {
    const { from, to, filterType, region } = this.state;
    const { longitude, latitude } = region;
    try {
      const { data } = await this.props.getMapTrips([longitude, latitude], from, to, filterType);

      if (data.nearByTrips && data.nearByTrips.length > 0) {
        if (!this.ismounted) {
          return;
        }

        const trips = data.nearByTrips.map((trip) => {
          const { startPoint, Routable, id } = trip;
          return {
            id,
            coordinate: {
              lng: startPoint[0],
              lat: startPoint[1],
            },
            trip: Routable,
          };
        });

        this.setState({ trips, loading: false, locationError: false, error: false });
      } else {
        this.setState({ loading: false, locationError: false, error: false });
      }
    } catch (error) {
      if (this.ismounted) {
        this.setState({ loading: false, error: true });
      }
    }
  }

  reTry = () => {
    this.setState({ loading: true }, this.getLocation);
  }

  renderCurrentLocation = () => {
    const { currentLocation, region } = this.state;
    if (!currentLocation) {
      return null;
    }

    const { latitude, longitude } = region;

    return (
      <Marker
        onPress={e => e.stopPropagation()}
        coordinate={{ latitude, longitude }}
        image={this.props.user.avatar}
        count={0}
        current
      />
    );
  }

  renderLoader = () => {
    const { locationError, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.itemContainer}>
          <Loading />
          <Text>Fetching data...</Text>
        </View>
      );
    }

    if (locationError) {
      return (
        <View style={styles.itemContainer}>
          <TouchableOpacity onPress={this.reTry}>
            <Text>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  renderTrip = () => {
    let coordinate = {};
    const { trips } = this.state;
    if (trips.length < 1) {
      return null;
    }

    return trips.map((row) => {
      coordinate = {
        latitude: row.coordinate.lat,
        longitude: row.coordinate.lng,
      };
      return (
        <Marker
          key={`${row.trip.id}-${moment().unix()}`}
          onPress={(e) => {
            e.stopPropagation();
            this.onMarkerPress(row.trip);
          }}
          coordinate={coordinate}
          image={row.trip.User.avatar}
          count={row.trip.seats}
          tripType={row.trip.type}
        />
      );
    });
  }

  render() {
    const { region } = this.state;
    return (
      <View style={styles.container}>
        <Navigation
          onPressBack={this.handleBack}
          onPressFilter={() => this.setState({ filterOpen: true })}
        />
        <MapView
          ref={(c) => { this.mapView = c; }}
          cacheEnabled
          loadingEnabled
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}
        >
          {this.renderTrip()}
          {this.renderCurrentLocation()}
        </MapView>
        {this.renderLoader()}
        <Filter
          map
          selected={this.state.filterType}
          onPress={this.onFilterChange}
          showModal={this.state.filterOpen}
          onCloseModal={() => this.setState({ filterOpen: false })}
        />
      </View>
    );
  }
}

Map.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  getMapTrips: PropTypes.func.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMapTrips, connect(mapStateToProps))(Map);
