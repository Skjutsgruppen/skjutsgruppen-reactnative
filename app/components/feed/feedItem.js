import React from 'react';
import PropTypes from 'prop-types';
import Group from './card/group';
import Offer from './card/offer';

const feedItem = ({ feed, onPress, onSharePress }) => {
  if (feed.feedable === 'trip') {
    return (<Offer onPress={onPress} onSharePress={onSharePress} offer={feed.Trip} />);
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
