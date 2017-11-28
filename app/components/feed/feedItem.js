import React from 'react';
import PropTypes from 'prop-types';
import Group from '@components/new/feed/card/group';
import Offer from '@components/new/feed/card/offer';
import Ask from '@components/new/feed/card/ask';

const feedItem = ({ feed, onPress, onSharePress }) => {
  if (feed.feedable === 'Trip') {
    if (feed.Trip.type === 'offered') {
      return (<Offer onPress={onPress} onSharePress={onSharePress} offer={feed.Trip} />);
    } else if (feed.Trip.type === 'wanted') {
      return (<Ask onPress={onPress} onSharePress={onSharePress} ask={feed.Trip} />);
    }
  }

  if (feed.feedable === 'Group') {
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
