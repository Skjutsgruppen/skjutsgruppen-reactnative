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
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';

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

class Map extends PureComponent {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = ({
      latitude: '',
      longitude: '',
      locationError: false,
      currentLocation: false,
      trips: [],
      error: '',
    });
  }

  componentWillMount() {
    const { latitude, longitude } = getCountryLocation();
    this.setState({ latitude, longitude, loading: true });
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

    if (Trip.type === FEED_TYPE_OFFER) {
      navigation.navigate('OfferDetail', { offer: Trip });
    }

    if (Trip.type === FEED_TYPE_WANTED) {
      navigation.navigate('AskDetail', { ask: Trip });
    }
  }

  async getLocation() {
    try {
      const res = await getCurrentLocation();
      this.setState({
        latitude: res.latitude,
        longitude: res.longitude,
        currentLocation: true,
        locationError: false,
      }, async () => {
        const trips = await this.fetchTripMap();

        if (!this.ismounted) {
          return;
        }

        this.setState({ trips, loading: false }, () => {
          const coordinate = [];

          trips.forEach((row) => {
            coordinate.push({
              latitude: row.coordinate.lat,
              longitude: row.coordinate.lng,
            });
          });

          this.fitMap(coordinate);
        });
      });
    } catch (error) {
      if (!this.state.currentLocation) {
        this.setState({ locationError: true });
      }
      this.setState({ error, loading: false });
    }
  }

  fitMap(coordinates) {
    if (coordinates.length < 1) return;

    this.mapView.fitToCoordinates(coordinates, {
      edgePadding: {
        right: Math.ceil(width / 5),
        bottom: Math.ceil(height / 5),
        left: Math.ceil(width / 5),
        top: Math.ceil(height / 5),
      },
      animation: false,
    });
  }

  async fetchTripMap() {
    const { data } = await this.props.getMapTrips([this.state.longitude, this.state.latitude]);

    let trips = [];

    if (data.nearByTrips) {
      trips = data.nearByTrips.map((trip) => {
        const { startPoint, Routable } = trip;
        return {
          coordinate: {
            lng: startPoint[0],
            lat: startPoint[1],
          },
          trip: Routable,
        };
      });
    }

    return trips;
  }

  renderCurrentLocation = () => {
    if (!this.state.currentLocation) {
      return null;
    }

    return (<Marker
      onPress={(e) => {
        e.stopPropagation();
      }}
      coordinate={{
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      }}
      image={this.props.user.avatar}
      count={0}
    />);
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
          key={row.trip.id}
          onPress={(e) => {
            e.stopPropagation();
            this.onMarkerPress(row.trip);
          }}
          coordinate={coordinate}
          image={row.trip.User.avatar}
          count={row.trip.seats}
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
        <MapView
          ref={(c) => { this.mapView = c; }}
          cacheEnabled
          loadingEnabled
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {this.renderTrip()}
          {this.renderCurrentLocation()}
        </MapView>
        <View style={styles.itemContainer}>
          {this.renderError()}
          {loading && <View><Loading /><Text>Fetching data...</Text></View>}
        </View>
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
