import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '@components/map/marker';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

class CloseByGroupsMapWindow extends Component {
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

  renderGroups = () => {
    let coordinate = {};
    const { groups } = this.state;

    if (groups && groups.length > 0) {
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
              return null;
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
    const { origin, loading } = this.props;

    if (loading) { return null; }

    return (
      <MapView
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

CloseByGroupsMapWindow.propTypes = {
  nearByGroups: PropTypes.shape({
    rows: PropTypes.array,
  }),
  origin: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  loading: PropTypes.bool,
};

CloseByGroupsMapWindow.defaultProps = {
  nearByGroups: {},
  loading: true,
};

export default withNavigation(CloseByGroupsMapWindow);
