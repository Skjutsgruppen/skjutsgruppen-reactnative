import React from 'react';
import PropTypes from 'prop-types';
import Group from './card/group';
import Offer from './card/offer';

const feedItem = ({ feed, onPress }) => {
  if (feed.feedable === 'trip') {
    return (<Offer onPress={onPress} offer={feed.Trip} />);
  }

  return (<Group onPress={onPress} group={feed.Group} />);
};

feedItem.propTypes = {
  feed: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default feedItem;
