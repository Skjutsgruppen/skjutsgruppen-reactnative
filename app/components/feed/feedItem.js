import React from 'react';
import PropTypes from 'prop-types';
import Group from '@components/new/feed/card/group';
import Offer from '@components/new/feed/card/offer';
import Ask from '@components/new/feed/card/ask';
import { FEEDABLE_TRIP, FEEDABLE_GROUP, FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';

const feedItem = ({ feed, onPress, onSharePress }) => {
  if (feed.feedable === FEEDABLE_TRIP) {
    if (feed.Trip.type === FEED_TYPE_OFFER) {
      return (<Offer onPress={onPress} onSharePress={onSharePress} offer={feed.Trip} />);
    } else if (feed.Trip.type === FEED_TYPE_WANTED) {
      return (<Ask onPress={onPress} onSharePress={onSharePress} ask={feed.Trip} />);
    }
  }

  if (feed.feedable === FEEDABLE_GROUP) {
    return (<Group onPress={onPress} onSharePress={onSharePress} group={feed.Group} />);
  }

  return null;
};

feedItem.propTypes = {
  feed: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default feedItem;
