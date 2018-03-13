import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '@components/map/marker';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

class CloseByGroupsMap extends Component {
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

    if (groups.length > 0) {
      return groups.map((group) => {
        coordinate = {
          latitude: group.TripStart.coordinates[1],
          longitude: group.TripStart.coordinates[0],
        };

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

  render() {
    const { origin } = this.props;

    return (
      <MapView
        initialRegion={origin}
        style={StyleSheet.absoluteFill}
        ref={(c) => { this.mapView = c; }}
        onMapReady={this.fitMap}
        cacheEnabled
      >
        {this.renderGroups()}
      </MapView>
    );
  }
}

CloseByGroupsMap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  nearByGroups: PropTypes.shape({
    rows: PropTypes.array,
  }),
  origin: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

CloseByGroupsMap.defaultProps = {
  nearByGroups: {},
};

export default withNavigation(CloseByGroupsMap);
