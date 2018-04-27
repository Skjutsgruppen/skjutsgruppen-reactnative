/* global navigator */
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View, Alert, Image } from 'react-native';
import MapView from 'react-native-maps';
import { getCoordinates } from '@services/map-directions';
import PropTypes from 'prop-types';
import { FEED_TYPE_WANTED, FEED_TYPE_OFFER, FEED_FILTER_EVERYTHING } from '@config/constant';
import Marker from '@components/map/marker';
import Navigation from '@components/map/navigation';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import { withGroup, withGroupTrips, withGroupParticipantIds } from '@services/apollo/group';
import { withLocationSharedToSpecificResource, withStopSpecific } from '@services/apollo/share';
import Filter from '@components/feed/filter';
import TripMarker from '@components/map/roundMarker';
import ShareLocation from '@components/common/shareLocation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import GeoLocation from '@services/location/geoLocation';
import { withUpdateLocation } from '@services/apollo/location';
import { withTrip } from '@services/apollo/trip';
import ConfirmModal from '@components/common/confirmModal';
import TouchableHighlight from '@components/touchableHighlight';
import Colors from '@theme/colors';
import MyLocationIcon from '@assets/icons/ic_my_location.png';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DURATION = 10;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.background.fullWhite,
    elevation: 2,
    zIndex: 200,
    overflow: 'hidden',
  },
  myLocationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ShareLocationWithData = compose(withStopSpecific, withGroupParticipantIds)(ShareLocation);

class RouteMap extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.mapView = null;
    this.state = ({
      myLocationIconBottom: 20,
      showTurnOnGpsModal: false,
      fetchingPosition: false,
      initialRegion: {
        longitude: 0,
        latitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
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
      info: {},
      sharedLocations: [],
      myPosition: {},
    });
  }

  componentWillMount() {
    const { navigation, group, trip, user } = this.props;
    const { data, subscribeToLocationShared } = this.props.locationSharedToSpecificResource;
    const { __typename } = navigation.state.params.info;
    let info = {};

    if (__typename === 'Group') info = group;
    else if (__typename === 'Trip') info = trip;

    subscribeToLocationShared({ userId: user.id, groupId: group.id, tripId: trip.id });

    this.setState({
      info,
      myPosition: {
        latitude: (info.Location && info.Location.locationCoordinates) ?
          info.Location.locationCoordinates[1] : null,
        longitude: (info.Location && info.Location.locationCoordinates) ?
          info.Location.locationCoordinates[0] : null,
      },
      origin: {
        longitude: (info.TripStart && info.TripStart.coordinates) ?
          info.TripStart.coordinates[0] : null,
        latitude: (info.TripStart && info.TripStart.coordinates) ?
          info.TripStart.coordinates[1] : null,
      },
      destination: {
        longitude: (info.TripEnd && info.TripEnd.coordinates) ? info.TripEnd.coordinates[0] : null,
        latitude: (info.TripEnd && info.TripEnd.coordinates) ? info.TripEnd.coordinates[1] : null,
      },
      stops: info.Stops,
      sharedLocations: data,
    });

    if ((info.TripStart && info.TripStart.coordinates)
      || (info.TripEnd && info.TripEnd.coordinates)) {
      this.setState({
        initialRegion: {
          longitude: info.TripStart.coordinates ?
            info.TripStart.coordinates[0] : info.TripEnd.coordinates[0],
          latitude: info.TripStart.coordinates ?
            info.TripStart.coordinates[1] : info.TripEnd.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
      });
    }
  }

  componentDidMount() {
    this.fetchPolygon();
  }

  componentWillReceiveProps({
    navigation,
    group,
    groupTrips,
    trip,
    locationSharedToSpecificResource }) {
    const sharedLocations = locationSharedToSpecificResource.data ?
      locationSharedToSpecificResource.data.filter(location => location.locationCoordinates) : [];
    const { __typename } = navigation.state.params.info;
    let info = {};

    if (__typename === 'Group') info = group;
    else if (__typename === 'Trip') info = trip;

    this.setState({
      info,
      myPosition: {
        latitude: (info.Location && info.Location.locationCoordinates) ?
          info.Location.locationCoordinates[1] : null,
        longitude: (info.Location && info.Location.locationCoordinates) ?
          info.Location.locationCoordinates[0] : null,
      },
      origin: {
        longitude: (info.TripStart && info.TripStart.coordinates) ?
          info.TripStart.coordinates[0] : null,
        latitude: (info.TripStart && info.TripStart.coordinates) ?
          info.TripStart.coordinates[1] : null,
      },
      destination: {
        longitude: (info.TripEnd && info.TripEnd.coordinates) ? info.TripEnd.coordinates[0] : null,
        latitude: (info.TripEnd && info.TripEnd.coordinates) ? info.TripEnd.coordinates[1] : null,
      },
      stops: info.Stops,
      trips: groupTrips,
      sharedLocations,
    });

    if ((info.TripStart && info.TripStart.coordinates)
      || (info.TripEnd && info.TripEnd.coordinates)) {
      this.setState({
        initialRegion: {
          longitude: info.TripStart.coordinates ?
            info.TripStart.coordinates[0] : info.TripEnd.coordinates[0],
          latitude: info.TripStart.coordinates ?
            info.TripStart.coordinates[1] : info.TripEnd.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
      });
    }
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

  openGpsSettings = () => {
    GeoLocation.showSettings();
    this.setState({ showTurnOnGpsModal: false });
  }

  updateMyLocationIconBottom = (bottom) => {
    this.setState({
      myLocationIconBottom: bottom + 20,
    });
  }

  currentLocation = async () => {
    this.setState({ fetchingPosition: true });

    try {
      const isGpsEnabled = await GeoLocation.isGpsEnabled();

      if (!isGpsEnabled) {
        this.setState({ showTurnOnGpsModal: true, fetchingPosition: false });

        return;
      }
    } catch (e) {
      console.warn(e);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          fetchingPosition: false,
          myPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
        this.gotoRegion([position.coords.longitude, position.coords.latitude]);
      },
      () => {
        this.setState({ fetchingPosition: false });
        Alert.alert('Sorry, could not track your location! Please check if your GPS is turned on.');
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  startTrackingLocation = () => {
    const { updateLocation } = this.props;
    const { info } = this.state;
    const { __typename } = info;

    GeoLocation.listenToLocationUpdate(__typename, info.id, (position) => {
      updateLocation([position.coords.longitude, position.coords.latitude]);
      this.setState({
        myPosition: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    });
  }

  stopTrackingLocation = () => {
    const { info } = this.state;
    const { __typename } = info;

    GeoLocation.stopListeningToLocationUpdate(__typename, info.id);
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
    const { origin, destination, stops = [] } = this.state;
    const stopsCoordinates = stops.map(row => `${row.coordinates[1]},${row.coordinates[0]}`);

    try {
      const { distance, duration, coordinates } = await getCoordinates({ start: origin, end: destination, stops: stopsCoordinates.join('|') });
      this.setState({ waypoints: coordinates, distance, duration }, this.fitMap);
    } catch (error) {
      const coords = [];
      if (origin.latitude && origin.longitude) {
        coords.push(origin);
      }
      stops.forEach((row) => {
        coords.push({ latitude: row.coordinates[1], longitude: row.coordinates[0] });
      });
      if (destination.latitude && origin.longitude) {
        coords.push(destination);
      }
      this.setState({ waypoints: coords, distance: 0, duration: 0 }, this.fitMap);
    }
  }

  fitMap = () => {
    if (!this.mapView || !(this.state.waypoints && this.state.waypoints.length > 0)) {
      if (this.state.origin.latitude && this.state.origin.longitude) {
        this.gotoRegion([this.state.origin.latitude, this.state.origin.longitude]);
      } else if (this.state.origin.latitude && this.state.origin.longitude) {
        this.gotoRegion([this.state.destination.latitude, this.state.destination.longitude]);
      }

      return;
    }

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

  gotoRegion = (coordinates) => {
    const region = {
      longitude: coordinates[0],
      latitude: coordinates[1],
      latitudeDelta: 0.00511,
      longitudeDelta: 0.00421,
    };

    if (this.mapView) this.mapView.animateToRegion(region, DURATION);
  }

  isMember = () => {
    const { info } = this.state;
    const { __typename } = info;

    if (__typename === 'Trip') return info.isParticipant;

    if (__typename === 'Group') return (info.membershipStatus === 'accepted');

    return false;
  }

  renderTurnOnGpsActionModal = () => (
    <ConfirmModal
      visible={this.state.showTurnOnGpsModal}
      loading={false}
      onDeny={() => this.setState({ showTurnOnGpsModal: false })}
      confirmLabel={'Open settings'}
      onConfirm={() => this.openGpsSettings()}
      message={'Your GPS is turned off.'}
      onRequestClose={() => this.setState({ showTurnOnGpsModal: false })}
    />
  )

  renderLiveLocations = () => {
    const { user } = this.props;
    const { sharedLocations, myPosition } = this.state;
    let markers = [];

    if (!this.isMember()) return null;

    if (sharedLocations.length > 0) {
      markers = sharedLocations.map((location) => {
        const coordinate = {
          latitude: location.locationCoordinates[1],
          longitude: location.locationCoordinates[0],
        };

        return (
          <Marker
            key={`${location.id}${moment().unix()}`}
            onPress={(e) => {
              e.stopPropagation();
            }}
            coordinate={coordinate}
            image={location.User.avatar}
          />
        );
      });
    }

    if (myPosition.latitude &&
      myPosition.longitude) {
      const coordinate = {
        latitude: myPosition.latitude,
        longitude: myPosition.longitude,
      };
      markers.push(
        <Marker
          key={`${moment().unix()}`}
          onPress={(e) => {
            e.stopPropagation();
          }}
          coordinate={coordinate}
          image={user.avatar}
        />);
    }

    return markers;
  }

  renderStops = () => {
    const { stops } = this.state;
    const color = 'red';

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
    const { loading, locationSharedToSpecificResource } = this.props;
    const {
      origin,
      destination,
      initialRegion,
      waypoints,
      info,
      myPosition,
      fetchingPosition } = this.state;
    const { __typename } = info;

    if (loading || locationSharedToSpecificResource.loading) return null;

    return (
      <View style={styles.container}>
        <Navigation
          arrowBackIcon
          showMenu={false}
          onPressBack={this.handleBack}
          onPressFilter={() => this.setState({ filterOpen: true })}
        />
        <View style={[styles.myLocationIconWrapper, { bottom: this.state.myLocationIconBottom }]}>
          <TouchableHighlight
            style={styles.myLocationIcon}
            onPress={() => this.currentLocation()}
          >
            <Image source={MyLocationIcon} />
          </TouchableHighlight>
        </View>
        <MapView
          provider={'google'}
          initialRegion={initialRegion}
          style={styles.map}
          ref={(c) => { this.mapView = c; }}
          onMapReady={this.fitMap}
          cacheEnabled
        >
          {origin.longitude && origin.latitude &&
            <MapView.Marker.Animated coordinate={origin}>
              <TripMarker />
            </MapView.Marker.Animated>
          }
          {destination.longitude && destination.latitude &&
            <MapView.Marker.Animated coordinate={destination}>
              <TripMarker type="destination" />
            </MapView.Marker.Animated>
          }
          {this.renderLiveLocations()}
          {this.renderStops()}
          {(waypoints.length > 0) &&
            <MapView.Polyline
              strokeWidth={5}
              strokeColor="#3b99fc"
              coordinates={waypoints}
            />
          }
        </MapView>
        <Filter
          map
          selected={this.state.filterType}
          onPress={this.onFilterChange}
          showModal={this.state.filterOpen}
          onCloseModal={() => this.setState({ filterOpen: false })}
        />
        {this.isMember() &&
          <ShareLocationWithData
            locationSharedToSpecificResource={locationSharedToSpecificResource}
            id={info.id}
            type={__typename}
            detail={info}
            gotoRegion={this.gotoRegion}
            myPosition={myPosition}
            startTrackingLocation={this.startTrackingLocation}
            stopTrackingLocation={this.stopTrackingLocation}
            currentLocation={this.currentLocation}
            fetchingPosition={fetchingPosition}
            onLayout={this.updateMyLocationIconBottom}
          />
        }
        {this.renderTurnOnGpsActionModal()}
      </View>
    );
  }
}

RouteMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  group: PropTypes.shape(),
  trip: PropTypes.shape(),
  groupTrips: PropTypes.arrayOf(PropTypes.shape()),
  locationSharedToSpecificResource: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    subscribeToLocationShared: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  updateLocation: PropTypes.func.isRequired,
};

RouteMap.defaultProps = {
  trip: {},
  group: {},
  groupTrips: [],
};

const mapStateToProps = state => ({ user: state.auth.user });

const RenderGroupRouteMap = compose(
  withLocationSharedToSpecificResource,
  withGroup,
  withUpdateLocation,
  withGroupTrips, connect(mapStateToProps))(RouteMap);

const RenderTripRouteMap = compose(
  withLocationSharedToSpecificResource,
  withTrip,
  withUpdateLocation,
  connect(mapStateToProps))(RouteMap);

const Route = ({ navigation }) => {
  const { id, __typename } = navigation.state.params.info;

  if (__typename === 'Group') {
    return (
      <RenderGroupRouteMap
        resourceId={id}
        resourceType={__typename}
        id={id}
        navigation={navigation}
      />
    );
  } else if (__typename === 'Trip') {
    return (
      <RenderTripRouteMap
        resourceId={id}
        resourceType={__typename}
        id={id}
        navigation={navigation}
      />
    );
  }

  return null;
};

Route.navigationOptions = {
  header: null,
};

Route.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Route);
