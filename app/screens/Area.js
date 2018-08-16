/* global navigator */
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View, Alert, Image, Platform } from 'react-native';
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
import ConfirmModal from '@components/common/confirmModal';
import TouchableHighlight from '@components/touchableHighlight';
import MyLocationIcon from '@assets/icons/ic_my_location.png';
import Colors from '@theme/colors';
import Loading from '@components/common/loading';
import { trans } from '../lang/i18n';

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

class AreaMap extends PureComponent {
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
        latitude: (group.Location && group.Location.locationCoordinates) ?
          group.Location.locationCoordinates[1] : null,
        longitude: (group.Location && group.Location.locationCoordinates) ?
          group.Location.locationCoordinates[0] : null,
      },
      initialRegion: {
        longitude: group.areaCoordinates ? group.areaCoordinates[0] : 0,
        latitude: group.areaCoordinates ? group.areaCoordinates[1] : 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: group.areaCoordinates ? group.areaCoordinates[0] : 0,
        latitude: group.areaCoordinates ? group.areaCoordinates[1] : 0,
      },
      sharedLocations: data || [],
    });
  }

  componentWillReceiveProps({ group, groupTrips, locationSharedToSpecificResource }) {
    const sharedLocations = locationSharedToSpecificResource.data ?
      locationSharedToSpecificResource.data.filter(location => location.locationCoordinates) : [];

    this.setState({
      myPosition: {
        latitude: (group.Location && group.Location.locationCoordinates) ?
          group.Location.locationCoordinates[1] : null,
        longitude: (group.Location && group.Location.locationCoordinates) ?
          group.Location.locationCoordinates[0] : null,
      },
      initialRegion: {
        longitude: group.areaCoordinates ? group.areaCoordinates[0] : 0,
        latitude: group.areaCoordinates ? group.areaCoordinates[1] : 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: group.areaCoordinates ? group.areaCoordinates[0] : 0,
        latitude: group.areaCoordinates ? group.areaCoordinates[1] : 0,
      },
      trips: groupTrips,
      sharedLocations,
    });
  }

  onFilterChange = (type) => {
    if (type !== this.state.filterType) {
      this.setState({ filterType: type, filterOpen: false, loading: true }, this.fetchTripsByType);
    }
  }

  onMarkerPress = ({ id }) => {
    const { navigation } = this.props;
    navigation.navigate('TripDetail', { id });
  }

  openGpsSettings = () => {
    GeoLocation.showSettings();
    this.setState({ showTurnOnGpsModal: false });
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
            timestamp: position.timestamp,
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

  updateMyLocationIconBottom = (bottom) => {
    this.setState({
      myLocationIconBottom: bottom + 20,
    });
  }

  startTrackingLocation = () => {
    const { updateLocation, group } = this.props;
    const { __typename } = group;

    GeoLocation.listenToLocationUpdate(__typename, group.id, (position) => {
      updateLocation([position.coords.longitude, position.coords.latitude]);
      this.setState({
        myPosition: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
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
      latitudeDelta: 0.00511,
      longitudeDelta: 0.00421,
    };

    this.mapView.animateToRegion(region, DURATION);
  }

  isMember = () => {
    const { group } = this.props;
    const { __typename } = group;

    if (__typename === 'Trip') return true;
    if (__typename === 'Group') return (group.membershipStatus === 'accepted');

    return false;
  }

  renderTurnOnGpsActionModal = () => (
    <ConfirmModal
      visible={this.state.showTurnOnGpsModal}
      loading={false}
      cancelable={(Platform === 'android' || Platform.OS === 'android')}
      onDeny={() => this.setState({ showTurnOnGpsModal: false })}
      confirmLabel={Platform === 'android' || Platform.OS === 'android' ? trans('global.open_settings') : trans('global.ok')}
      onConfirm={() => this.openGpsSettings()}
      message={trans(Platform === 'android' || Platform.OS === 'android' ? 'global.gps_turned_off_android' : 'global.gps_turned_off_ios')}
      onRequestClose={() => this.setState({ showTurnOnGpsModal: false })}
    />
  )

  renderLiveLocations = () => {
    const { user } = this.props;
    const { sharedLocations, myPosition } = this.state;

    if (!this.isMember()) return null;

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

  render() {
    const { loading, group, locationSharedToSpecificResource, navigation } = this.props;
    const { origin, initialRegion, myPosition, fetchingPosition } = this.state;
    const { __typename } = group;
    const { pressShareLocation } = navigation.state.params;

    if (loading || locationSharedToSpecificResource.loading) return <Loading style={{ ...StyleSheet.absoluteFillObject }} />;

    return (
      <View style={styles.container}>
        <Navigation
          arrowBackIcon
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
          <MapView.Marker.Animated coordinate={origin}>
            <TripMarker />
          </MapView.Marker.Animated>
          {this.renderLiveLocations()}
        </MapView>

        {this.isMember() &&
          <ShareLocationWithData
            locationSharedToSpecificResource={locationSharedToSpecificResource}
            id={group.id}
            type={__typename}
            detail={group}
            gotoRegion={this.gotoRegion}
            myPosition={myPosition}
            startTrackingLocation={this.startTrackingLocation}
            stopTrackingLocation={this.stopTrackingLocation}
            currentLocation={this.currentLocation}
            fetchingPosition={fetchingPosition}
            onLayout={this.updateMyLocationIconBottom}
            pressShareLocation={pressShareLocation}
          />
        }
        {this.renderTurnOnGpsActionModal()}
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
