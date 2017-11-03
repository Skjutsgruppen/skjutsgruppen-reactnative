/* global navigator */
import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { Loading } from '@components/common';
import { withMapTrips } from '@services/apollo/map';
import TripMarker from '@components/map/tripMarker';
import PropTypes from 'prop-types';

const TripMap = withMapTrips(TripMarker);

class Map extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    });
  }

  componentWillMount() {
    this.currentLocation();
  }

  onMarkerPress = (Trip) => {
    const { navigation } = this.props;

    if (Trip.type === 'offered') {
      navigation.navigate('OfferDetail', { offer: Trip });
    }

    if (Trip.type === 'wanted') {
      navigation.navigate('AskDetail', { ask: Trip });
    }
  }

  currentLocation = () => {
    this.setState({ loading: true });
    const { region } = this.state;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        region.latitude = position.coords.latitude;
        region.longitude = position.coords.longitude;
        this.setState({ region, loading: false });
      },
      (error) => {
        Alert.alert(error.message);
        this.setState({ loading: false });
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  render() {
    if (this.state.loading) {
      return (<Loading />);
    }

    return (
      <TripMap
        onMarkerPress={this.onMarkerPress}
        lat={this.state.region.latitude}
        lng={this.state.region.longitude}
      />
    );
  }
}

Map.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};


export default Map;
