import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import TripMarker from '@components/map/roundMarker';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Area extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.mapView = null;
    this.state = ({ initialRegion: {}, origin: {}, waypoints: [], distance: '', duration: '' });
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

  render() {
    const { origin, initialRegion } = this.state;

    return (
      <View style={StyleSheet.absoluteFill}>
        <ToolBar transparent />
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
        </MapView>
      </View>
    );
  }
}

Area.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Area;
