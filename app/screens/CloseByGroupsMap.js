import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { withNearByGroups } from '@services/apollo/group';
import { MapView, Marker as ClusterMarker } from 'react-native-maps';
import Marker from '@components/map/marker';
import { FEED_TYPE_GROUP } from '@config/constant';
import { compose } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import ClusteredMapView from 'react-native-maps-super-cluster';
import debounce from 'lodash/debounce';

class CloseByGroupsMapView extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.mapView = null;

    this.state = {
      groups: [],
    };
    this.currentDiameter = 0;
    this.maxDiameter = 100;
  }

  componentWillReceiveProps({ nearByGroups }) {
    this.setState({ groups: nearByGroups.rows });
  }

  onMarkerPress = ({ id }) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { id });
  }

  getDeltaValue = (diameter = 5) => (1 * diameter) / 111

  deltaToKm = delta => 111 * delta

  fetchMoreGroups = debounce(({ latitudeDelta, latitude, longitude }) => {
    const { from } = this.props;
    const diameter = Math.round(this.deltaToKm(latitudeDelta));

    if (diameter < this.currentDiameter) return;
    this.currentDiameter = diameter;
    if (diameter > this.currentDiameter && diameter < this.maxDiameter) {
      this.currentDiameter = diameter;
      this.props.fetchMore({
        variables: {
          from,
          distFrom: 0,
          distTo: 100000000,
          outreach: null,
          type: null,
          diameter,
          limit: null,
          offset: null,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const { nearByGroups: { count } } = fetchMoreResult;
          if (count > 0) {
            return fetchMoreResult;
          }
          return previousResult;
        },
      });
    } else if (from[0] !== longitude && from[1] !== latitude) {
      this.props.fetchMore({
        variables: {
          from: [longitude, latitude],
          distFrom: 0,
          distTo: 100000000,
          outreach: null,
          type: null,
          diameter,
          limit: null,
          offset: null,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const { nearByGroups: { count } } = fetchMoreResult;
          if (count > 0) {
            return fetchMoreResult;
          }
          return previousResult;
        },
      });
    }
  }, 1000, { leading: false, trailing: true });

  handleClusterPress = (children, cluster) => {
    const { navigation } = this.props;
    const lat = cluster[0].TripStart.coordinates[0];
    const long = cluster[0].TripStart.coordinates[1];
    for (let i = 1; i < cluster.length; i++) {
      if (lat !== cluster[i].TripStart.coordinates[0] || long !== cluster[i].TripStart.coordinates[1]) {
        return;
      }
    }
    const name = cluster[0].TripStart.name;
    const lat1 = cluster[0].TripStart.coordinates[0];
    const long1 = cluster[0].TripStart.coordinates[1];
    navigation.navigate('Search', { fromObj: { name, coordinates: [lat1, long1], countryCode: cluster[0].TripStart.countryCode }, toObj: { name: '', countryCode: '', coordinates: [] }, direction: 'anywhere', dates: [], filters: [FEED_TYPE_GROUP] });
  }

  renderMarker=(group) => {
    let coordinate = {};
    if (group.isBlocked) return null;

    if (group.outreach === 'area') {
      coordinate = {
        latitude: group.areaCoordinates[1],
        longitude: group.areaCoordinates[0],
      };
    } else if (group.TripStart && group.TripStart.coordinates) {
      coordinate = {
        latitude: group.TripStart.coordinates[1],
        longitude: group.TripStart.coordinates[0],
      };
    }

    if (!coordinate.latitude || !coordinate.longitude) return null;
    return (
      <Marker
        key={`${group.id}-${moment().unix()}`}
        onPress={(e) => {
          e.stopPropagation();
          this.onMarkerPress(group);
        }}
        coordinate={coordinate}
        image={group.photo || ''}
      />
    );
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount;
    const coordinate = cluster.coordinate;

    return (
      <Marker clustered={pointCount} coordinate={coordinate} onPress={onPress} />
    );
  }

  renderCurrentLocation = () => {
    const { origin } = this.props;

    if (!origin) {
      return null;
    }

    const { latitude, longitude } = origin;

    return (
      <Marker
        onPress={e => e.stopPropagation()}
        coordinate={{ latitude, longitude }}
        current
      />
    );
  }

  render() {
    const { origin } = this.props;
    const { groups } = this.state;
    const { latitude, longitude } = origin;
    const INIT_REGION = {
      latitude,
      longitude,
      latitudeDelta: 2,
      longitudeDelta: 2,
    };
    const newGroup = !groups ? [] : groups.map(group => ({
      ...group,
      location: {
        latitude: group.TripStart.coordinates[1],
        longitude: group.TripStart.coordinates[0],
      },
    }));

    return (
      <ClusteredMapView
        style={{ flex: 1 }}
        ref={(c) => { this.mapView = c; }}
        data={newGroup || []}
        initialRegion={INIT_REGION}
        renderCluster={this.renderCluster}
        renderMarker={this.renderMarker}
        preserveClusterPressBehavior
        onClusterPress={this.handleClusterPress}
        onRegionChangeComplete={this.fetchMoreGroups}
      >
        <Marker
          onPress={e => e.stopPropagation()}
          coordinate={{ latitude, longitude }}
          current
        />
      </ClusteredMapView>
    );
  }
}

CloseByGroupsMapView.propTypes = {
  nearByGroups: PropTypes.shape({
    rows: PropTypes.array,
  }),
  origin: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  fetchMore: PropTypes.func.isRequired,
  from: PropTypes.arrayOf(PropTypes.number).isRequired,
};

CloseByGroupsMapView.defaultProps = {
  nearByGroups: {},
};

const NearByGroupsMap = compose(withNavigation, withNearByGroups)(CloseByGroupsMapView);

const CloseByGroupsMap = ({ navigation }) => {
  const { origin } = navigation.state.params;

  return (
    <View style={StyleSheet.absoluteFill}>
      <ToolBar transparent />
      <NearByGroupsMap
        from={[origin.longitude, origin.latitude]}
        distFrom={0}
        distTo={100000000}
        origin={origin}
        outreach={null}
        type={null}
      />
    </View>
  );
};

CloseByGroupsMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

CloseByGroupsMap.navigationOptions = {
  header: null,
};

export default compose(withNavigation)(CloseByGroupsMap);
