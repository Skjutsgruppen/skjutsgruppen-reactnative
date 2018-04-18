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
  }

  componentWillReceiveProps({ nearByGroups }) {
    this.setState({ groups: nearByGroups.rows });
  }

  onMarkerPress = (detail) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { group: detail });
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
        } else {
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
            image={group.User.avatar}
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
      >
        {this.renderCurrentLocation()}
        {this.renderGroups()}
      </MapView>
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
