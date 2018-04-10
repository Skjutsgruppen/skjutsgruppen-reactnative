/* global navigator */
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View, Alert } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import { FEED_FILTER_EVERYTHING } from '@config/constant';
import Navigation from '@components/map/navigation';
import TripMarker from '@components/map/roundMarker';
import Marker from '@components/map/marker';
import Filter from '@components/feed/filter';
import GeoLocation from '@services/location/geoLocation';
import { withGroup, withGroupTrips, withGroupParticipantIds } from '@services/apollo/group';
import { withLocationSharedToSpecificResource, withStopSpecific } from '@services/apollo/share';
import ShareLocation from '@components/common/shareLocation';
import { withUpdateLocation } from '@services/apollo/location';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 3;
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
});

const ShareLocationWithData = compose(withStopSpecific, withGroupParticipantIds)(ShareLocation);

class AreaMap extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.mapView = null;
    this.state = ({
      initialRegion: {},
      origin: {},
      waypoints: [],
      distance: '',
      duration: '',
      trips: [],
      filterOpen: false,
      loading: false,
      error: '',
      filterType: FEED_FILTER_EVERYTHING,
      group: {},
      sharedLocations: [],
      myPosition: {},
    });
  }

  componentWillMount() {
    const { group, user } = this.props;
    const { data, subscribeToLocationShared } = this.props.locationSharedToSpecificResource;

    subscribeToLocationShared({ userId: user.id, groupId: group.id });

    this.setState({
      myPosition: {
        latitude: group.Location.locationCoordinates ?
          group.Location.locationCoordinates[1] : null,
        longitude: group.Location.locationCoordinates ?
          group.Location.locationCoordinates[0] : null,
      },
      initialRegion: {
        longitude: group.areaCoordinates[0],
        latitude: group.areaCoordinates[1],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: group.areaCoordinates[0],
        latitude: group.areaCoordinates[1],
      },
      sharedLocations: data || [],
    });
  }

  componentWillReceiveProps({ groupTrips, locationSharedToSpecificResource }) {
    const sharedLocations = locationSharedToSpecificResource.data ?
      locationSharedToSpecificResource.data.filter(location => location.locationCoordinates) : [];

    this.setState({
      trips: groupTrips,
      sharedLocations,
    });
  }

  onFilterChange = (type) => {
    if (type !== this.state.filterType) {
      this.setState({ filterType: type, filterOpen: false, loading: true }, this.fetchTripsByType);
    }
  }

  onMarkerPress = (Trip) => {
    const { navigation } = this.props;
    navigation.navigate('TripDetail', { trip: Trip });
  }

  currentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          myPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      () => {
        Alert.alert('Sorry, could not track your location! Please check if your GPS is turned on.');
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  startTrackingLocation = () => {
    const { updateLocation, group } = this.props;
    const { __typename } = group;

    GeoLocation.listenToLocationUpdate(__typename, group.id, (position) => {
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
    const { group } = this.props;
    const { __typename } = group;

    GeoLocation.stopListeningToLocationUpdate(__typename, group.id);
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

  handleBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  gotoRegion = (coordinates) => {
    const region = {
      longitude: coordinates[0],
      latitude: coordinates[1],
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    this.mapView.animateToRegion(region, DURATION);
  }

  renderLiveLocations = () => {
    const { group } = this.props;
    const { sharedLocations, myPosition } = this.state;

    let markers = [];
    if (sharedLocations.length > 0) {
      markers = sharedLocations.map((location) => {
        const coordinate = {
          latitude: location.locationCoordinates[1],
          longitude: location.locationCoordinates[0],
        };

        return (
          <Marker
            key={`${location.id}-${moment().unix()}`}
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
      myPosition.longitude &&
      group.Location.locationCoordinates &&
      group.Location.locationCoordinates.length > 0) {
      const coordinate = {
        latitude: myPosition.latitude,
        longitude: myPosition.longitude,
      };
      markers.push(
        <Marker
          key={`${group.Location.id}-${moment().unix()}`}
          onPress={(e) => {
            e.stopPropagation();
          }}
          coordinate={coordinate}
          image={group.Location.User.avatar}
        />);
    }

    return markers;
  }

  render() {
    const { loading, group, locationSharedToSpecificResource } = this.props;
    const { origin, initialRegion } = this.state;
    const { __typename } = group;

    if (loading || locationSharedToSpecificResource.loading) return null;

    return (
      <View style={styles.container}>
        <Navigation
          arrowBackIcon
          onPressBack={this.handleBack}
          onPressFilter={() => this.setState({ filterOpen: true })}
        />
        <MapView
          initialRegion={initialRegion}
          style={styles.map}
          ref={(c) => { this.mapView = c; }}
          onMapReady={this.fitMap}
          cacheEnabled
        >
          <MapView.Marker.Animated coordinate={origin}>
            <TripMarker />
          </MapView.Marker.Animated>
          {this.renderLiveLocations()}
        </MapView>
        <Filter
          map
          selected={this.state.filterType}
          onPress={this.onFilterChange}
          showModal={this.state.filterOpen}
          onCloseModal={() => this.setState({ filterOpen: false })}
        />
        <ShareLocationWithData
          locationSharedToSpecificResource={locationSharedToSpecificResource}
          id={group.id}
          type={__typename}
          detail={group}
          gotoRegion={this.gotoRegion}
          myPosition={this.myPosition}
          startTrackingLocation={this.startTrackingLocation}
          stopTrackingLocation={this.stopTrackingLocation}
        />
      </View>
    );
  }
}

AreaMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  group: PropTypes.shape().isRequired,
  groupTrips: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  locationSharedToSpecificResource: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    subscribeToLocationShared: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  updateLocation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const RenderAreaMap = compose(
  withLocationSharedToSpecificResource,
  withGroup,
  withUpdateLocation,
  withGroupTrips, connect(mapStateToProps))(AreaMap);

const Area = ({ navigation }) => {
  const { id, __typename } = navigation.state.params.info;

  return (
    <RenderAreaMap
      resourceId={id}
      resourceType={__typename}
      id={id}
      navigation={navigation}
    />
  );
};

Area.navigationOptions = {
  header: null,
};

Area.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Area);
