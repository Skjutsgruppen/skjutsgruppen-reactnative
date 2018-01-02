import React from 'react';
import PropTypes from 'prop-types';
import Group from '@components/feed/card/group';
import Offer from '@components/feed/card/offer';
import Ask from '@components/feed/card/ask';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';

const SearchItem = ({ searchResult, onPress, onSharePress }) => {
  if (searchResult.type === FEED_TYPE_WANTED) {
    return (<Ask onPress={onPress} onSharePress={onSharePress} ask={searchResult} />);
  } else if (searchResult.type === FEED_TYPE_OFFER) {
    return (<Offer onPress={onPress} onSharePress={onSharePress} offer={searchResult} />);
  }

  return (<Group onPress={onPress} onSharePress={onSharePress} group={searchResult} />);
};

SearchItem.propTypes = {
  searchResult: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default SearchItem;
