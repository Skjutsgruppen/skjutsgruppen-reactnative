import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import { FEED_FILTER_EVERYTHING } from '@config/constant';
import Navigation from '@components/map/navigation';
import TripMarker from '@components/map/roundMarker';
import Marker from '@components/map/marker';
import { withGroupTrips } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import Filter from '@components/feed/filter';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { coordinates } = navigation.state.params;

    this.setState({
      initialRegion: {
        longitude: coordinates.area[0],
        latitude: coordinates.area[1],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: coordinates.area[0],
        latitude: coordinates.area[1],
      },
    });
  }

  componentWillReceiveProps({ groupTrips }) {
    this.setState({ trips: groupTrips });
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

  render() {
    const { origin, initialRegion } = this.state;

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
          {this.renderTrips()}
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

AreaMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  groupTrips: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const RenderAreaMap = withGroupTrips(AreaMap);

const Area = ({ navigation }) => (
  <RenderAreaMap
    id={navigation.state.params.id}
    navigation={navigation}
  />
);

Area.navigationOptions = {
  header: null,
};

Area.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Area);
