import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { getCoordinates } from '@services/map-directions';
import PropTypes from 'prop-types';
import { FEED_TYPE_WANTED, FEED_TYPE_OFFER, FEED_FILTER_EVERYTHING } from '@config/constant';
import Navigation from '@components/map/navigation';
import TripMarker from '@components/map/roundMarker';
import Marker from '@components/map/marker';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import { withGroupTrips } from '@services/apollo/group';
import Filter from '@components/feed/filter';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class RouteMap extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.mapView = null;
    this.state = ({
      initialRegion: {},
      origin: {},
      destination: {},
      stops: [],
      waypoints: [],
      distance: '',
      duration: '',
      trips: [],
      filterOpen: false,
      loading: false,
      error: '',
      filterType: FEED_FILTER_EVERYTHING,
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { coordinates } = navigation.state.params;

    this.setState({
      initialRegion: {
        longitude: coordinates.start.coordinates[0],
        latitude: coordinates.start.coordinates[1],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: coordinates.start.coordinates[0],
        latitude: coordinates.start.coordinates[1],
      },
      destination: {
        longitude: coordinates.end.coordinates[0],
        latitude: coordinates.end.coordinates[1],
      },
      stops: coordinates.stops,
    });
  }

  componentDidMount() {
    this.fetchPolygon();
  }

  componentWillReceiveProps({ groupTrips }) {
    this.setState({ trips: groupTrips });
  }

  onMarkerPress = (Trip) => {
    const { navigation } = this.props;
    navigation.navigate('TripDetail', { trip: Trip });
  }

  onFilterChange = (type) => {
    if (type !== this.state.filterType) {
      this.setState({ filterType: type, filterOpen: false, loading: true }, this.fetchTripsByType);
    }
  }

  async fetchTripsByType() {
    const { refetch } = this.props;
    const { filterType } = this.state;

    this.setState({ loading: true });
    try {
      refetch({ filter: filterType }).then(({ data }) => {
        this.setState({ trips: data.groupTrips });
      })
        .catch(err => this.setState({ error: err, loading: false }));
    } catch (err) {
      this.setState({ error: err, loading: false });
    }
  }

  async fetchPolygon() {
    const { origin, destination, stops } = this.state;
    const stopsCoordinates = stops.map(row => `${row.coordinates[1]},${row.coordinates[0]}`);

    try {
      const { distance, duration, coordinates } = await getCoordinates({ start: origin, end: destination, stops: stopsCoordinates.join('|') });
      this.setState({ waypoints: coordinates, distance, duration }, this.fitMap);
    } catch (error) {
      const coords = [];
      coords.push(origin);
      stops.forEach((row) => {
        coords.push({ latitude: row.coordinates[1], longitude: row.coordinates[0] });
      });
      coords.push(destination);
      this.setState({ waypoints: coords, distance: 0, duration: 0 }, this.fitMap);
    }
  }

  fitMap = () => {
    if (this.state.waypoints.length < 1) return;
    try {
      this.mapView.fitToCoordinates(this.state.waypoints, {
        edgePadding: {
          right: Math.ceil(width / 5),
          bottom: Math.ceil(height / 5),
          left: Math.ceil(width / 5),
          top: Math.ceil(height / 5),
        },
        animation: false,
      });
    } catch (error) {
      console.warn(error.message);
    }
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderTrips = () => {
    let coordinate = {};
    const { trips } = this.state;

    if (trips.length > 0) {
      return trips.map((trip) => {
        coordinate = {
          latitude: trip.TripStart.coordinates[1],
          longitude: trip.TripStart.coordinates[0],
        };

        return (
          <Marker
            key={`${trip.id}-${moment().unix()}`}
            onPress={(e) => {
              e.stopPropagation();
              this.onMarkerPress(trip);
            }}
            coordinate={coordinate}
            image={trip.User.avatar}
            count={trip.seats}
            tripType={trip.type}
          />
        );
      });
    }

    return null;
  }

  renderStops = () => {
    const { stops } = this.state;
    const { navigation } = this.props;
    const { type } = navigation.state.params;

    let color = null;
    if (FEED_TYPE_WANTED === type) {
      color = 'blue';
    }

    if (FEED_TYPE_OFFER === type) {
      color = 'pink';
    }

    let i = 0;
    return stops.map((row) => {
      i += 1;
      return (
        <MapView.Marker.Animated
          key={i}
          coordinate={{ longitude: row.coordinates[0], latitude: row.coordinates[1] }}
        >
          <TripMarker color={color} />
        </MapView.Marker.Animated>
      );
    });
  }

  render() {
    const { origin, destination, initialRegion, waypoints } = this.state;

    return (
      <View style={StyleSheet.absoluteFill}>
        <Navigation
          arrowBackIcon
          onPressBack={this.handleBack}
          onPressFilter={() => this.setState({ filterOpen: true })}
        />
        <MapView
          initialRegion={initialRegion}
          style={StyleSheet.absoluteFill}
          ref={(c) => { this.mapView = c; }}
          onMapReady={this.fitMap}
          cacheEnabled
        >
          <MapView.Marker.Animated coordinate={origin}>
            <TripMarker />
          </MapView.Marker.Animated>
          <MapView.Marker.Animated coordinate={destination}>
            <TripMarker type="destination" />
          </MapView.Marker.Animated>
          {this.renderTrips()}
          {this.renderStops()}
          <MapView.Polyline
            strokeWidth={5}
            strokeColor="#3b99fc"
            coordinates={waypoints}
          />
        </MapView>
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

RouteMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  groupTrips: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const RenderRouteMap = withGroupTrips(RouteMap);
const Route = ({ navigation }) => (
  <RenderRouteMap
    id={navigation.state.params.id}
    navigation={navigation}
  />
);

Route.navigationOptions = {
  header: null,
};

Route.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Route);
