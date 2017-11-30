import React from 'react';
import PropTypes from 'prop-types';
import Group from '@components/feed/card/group';
import Offer from '@components/feed/card/offer';
import Ask from '@components/feed/card/ask';

const feedItem = ({ feed, onPress, onSharePress }) => {
  if (feed.feedable === 'Trip') {
    if (feed.Trip.type === 'offered') {
      return (<Offer onPress={onPress} onSharePress={onSharePress} offer={feed.Trip} />);
    } else if (feed.Trip.type === 'wanted') {
      return (<Ask onPress={onPress} onSharePress={onSharePress} ask={feed.Trip} />);
    }
  }

  return (<Group onPress={onPress} onSharePress={onSharePress} group={feed.Group} />);
};

feedItem.propTypes = {
  feed: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default feedItem;
