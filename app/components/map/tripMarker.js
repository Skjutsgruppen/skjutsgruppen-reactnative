import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '@components/map/marker';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const TripMarker = ({ lat, lng, loading, trips, user, onMarkerPress }) => {
  if (loading) return <Loading />;
  let coordinate = {};
  const renderMarkers = trips.map((row) => {
    coordinate = {
      latitude: row.coordinate.lat,
      longitude: row.coordinate.lng,
    };
    return (
      <Marker
        key={row.trip.id}
        onPress={(e) => {
          e.stopPropagation();
          onMarkerPress(row.trip);
        }}
        coordinate={coordinate}
        image={row.trip.User.photo}
        count={row.trip.seats}
      />
    );
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        }
      >
        <Marker
          onPress={(e) => {
            e.stopPropagation();
          }}
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          image={user.photo}
          count={0}
        />
        {renderMarkers}
      </MapView>
    </View>
  );
};

TripMarker.propTypes = {
  onMarkerPress: PropTypes.func.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  trips: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    photo: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(TripMarker);
