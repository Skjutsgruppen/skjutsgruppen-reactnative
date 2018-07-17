import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { withNearByGroups } from '@services/apollo/group';
import MapView from 'react-native-maps';
import Marker from '@components/map/marker';
import { compose } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

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
    this.currentDiameter = 5;
  }

  componentWillReceiveProps({ nearByGroups }) {
    this.setState({ groups: nearByGroups.rows });
  }

  onMarkerPress = ({ id }) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { id });
  }

  getDeltaValue = (diameter = 5) => {
    return (1 * diameter) / 111;
  }

  deltaToKm = delta => 111 * delta

  fetchMoreGroups = ({ latitudeDelta, latitude, longitude }) => {
    console.log(latitudeDelta);
    console.log(this.props);
    console.log(latitude, longitude);
    const diameter = Math.round(this.deltaToKm(latitudeDelta));
    console.log(diameter);

    if (diameter > this.currentDiameter) {
      this.currentDiameter = diameter;
      this.props.fetchMore({
        variables: {
          from: this.props.from,
          distFrom: 0,
          distTo: 100000000,
          outreach: null,
          type: null,
          diameter,
          limit: null,
          offset: null,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult;
        },
      });
    }
  }

  renderGroups = () => {
    let coordinate = {};
    const { groups } = this.state;

    if (groups && groups.length > 0) {
      return groups.map((group) => {
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
            image={group.photo}
          />
        );
      });
    }

    return null;
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

    return (
      <MapView
        provider={'google'}
        initialRegion={origin}
        style={StyleSheet.absoluteFill}
        ref={(c) => { this.mapView = c; }}
        cacheEnabled
        onRegionChangeComplete={region => this.fetchMoreGroups(region)}
      >
        {this.renderCurrentLocation()}
        {this.renderGroups()}
      </MapView >
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
