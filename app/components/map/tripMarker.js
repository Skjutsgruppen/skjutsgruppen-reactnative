import React from 'react';
import Marker from '@components/map/marker';
import PropTypes from 'prop-types';

const TripMarker = ({ trips, onMarkerPress }) => {
  let coordinate = {};
  if (trips.length < 1) {
    return null;
  }

  return trips.map((row) => {
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
        image={row.trip.User.avatar}
        count={row.trip.seats}
      />
    );
  });
};

TripMarker.propTypes = {
  onMarkerPress: PropTypes.func.isRequired,
  trips: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TripMarker;
