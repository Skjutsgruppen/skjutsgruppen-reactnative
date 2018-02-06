import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    position: 'absolute',
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
      latitude: '',
      longitude: '',
      filterOpen: false,
      filterType: FEED_FILTER_EVERYTHING,
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      locationError: false,
      currentLocation: false,
      trips: [],
      error: '',
      from: 0,
      to: DISTANCE_GAP,
    });
    this.region = {};
  }

  componentWillMount() {
    const { latitude, longitude } = getCountryLocation();
    const { region } = this.state;
    const updatedRegion = { ...region, ...{ latitude, longitude } };
    this.setState({ latitude, longitude, region: updatedRegion, loading: true });
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
    const { longitude, latitude } = this.state;
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
      const { region } = this.state;

      const updatedRegion = { ...region, ...{ latitude, longitude } };

      this.setState({
        latitude,
        longitude,
        currentLocation: true,
        region: updatedRegion,
        locationError: false,
      }, this.fetchTripMap);
    } catch (error) {
      if (!this.state.currentLocation) {
        this.setState({ locationError: true });
      }
      this.setState({ error, loading: false });
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
    const { from, to, longitude, latitude, filterType } = this.state;
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

      this.setState({
        trips,
        loading: false,
        region: { ...this.state.region, ...this.region },
      });
    }
  }

  renderCurrentLocation = () => {
    const { currentLocation, latitude, longitude } = this.state;
    if (!currentLocation) {
      return null;
    }

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

  renderError = () => {
    const { locationError } = this.state;

    if (!locationError) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity onPress={this.currentLocation}>
          <Text>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
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
    const { loading } = this.state;

    if (loading && this.state.latitude === '') {
      return (<Loading />);
    }

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
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.renderTrip()}
          {this.renderCurrentLocation()}
        </MapView>
        <View style={styles.itemContainer}>
          {this.renderError()}
          {loading && <View><Loading /><Text>Fetching data...</Text></View>}
        </View>
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
