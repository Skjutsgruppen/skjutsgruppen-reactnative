import React from 'react';
import PropTypes from 'prop-types';
import Ask from '@components/feed/card/ask';
import Offer from '@components/feed/card/offer';
import { FEED_TYPE_OFFER } from '@config/constant';

const TripsItem = ({ trip, onPress, onSharePress }) => {
  if (trip.type === FEED_TYPE_OFFER) {
    return (
      <Offer
        offer={trip}
        onPress={onPress}
        onSharePress={onSharePress}
        wrapperStyle={{ marginTop: 8 }}
      />
    );
  }

  return (
    <Ask
      ask={trip}
      onPress={onPress}
      onSharePress={onSharePress}
      wrapperStyle={{ marginVertical: 8, height: 500 }}
    />
  );
};

TripsItem.propTypes = {
  trip: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default TripsItem;
