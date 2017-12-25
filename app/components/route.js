import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { getCoordinates } from '@services/map-directions';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Route extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.mapView = null;
    this.state = ({ initialRegion: {}, origin: {}, destination: {}, stops: [], waypoints: [], distance: '', duration: '' });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { coordinates } = navigation.state.params;
    this.setState({
      initialRegion: {
        longitude: coordinates.start.coordinates[0],
        latitude: coordinates.start.coordinates[1],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        longitude: coordinates.start.coordinates[0],
        latitude: coordinates.start.coordinates[1],
      },
      destination: {
        longitude: coordinates.end.coordinates[0],
        latitude: coordinates.end.coordinates[1],
      },
      stops: coordinates.stops,
    });
  }

  componentDidMount() {
    this.fetchPolygon();
  }

  async fetchPolygon() {
    const { origin, destination, stops } = this.state;
    const stopsCoordinates = stops.map(row => `${row.coordinates[1]},${row.coordinates[0]}`);

    try {
      const { distance, duration, coordinates } = await getCoordinates({ start: origin, end: destination, stops: stopsCoordinates.join('|') });
      this.setState({ waypoints: coordinates, distance, duration }, this.fitMap);
    } catch (error) {
      const coords = [];
      coords.push(origin);
      stops.forEach((row) => {
        coords.push({ latitude: row.coordinates[1], longitude: row.coordinates[0] });
      });
      coords.push(destination);
      this.setState({ waypoints: coords, distance: 0, duration: 0 }, this.fitMap);
    }
  }

  fitMap = () => {
    this.mapView.fitToCoordinates([this.state.origin, this.state.destination], {
      edgePadding: {
        right: Math.ceil(width / 20),
        bottom: Math.ceil(height / 20),
        left: Math.ceil(width / 20),
        top: Math.ceil(height / 20),
      },
      animation: true,
    });
  }

  renderStops = () => {
    const { stops } = this.state;
    let i = 0;
    return stops.map((row) => {
      i += 1;
      return (
        <MapView.Marker.Animated
          key={i}
          coordinate={{ longitude: row.coordinates[0], latitude: row.coordinates[1] }}
        />
      );
    });
  }

  render() {
    const { origin, destination, initialRegion, waypoints } = this.state;

    return (
      <MapView
        initialRegion={initialRegion}
        style={StyleSheet.absoluteFill}
        ref={(c) => { this.mapView = c; }}
        onMapReady={this.fitMap}
      >
        <MapView.Marker.Animated coordinate={origin} />
        <MapView.Marker.Animated coordinate={destination} />
        {this.renderStops()}
        <MapView.Polyline
          strokeWidth={5}
          strokeColor="#3b99fc"
          coordinates={waypoints}
        />
      </MapView>
    );
  }
}

Route.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Route;
