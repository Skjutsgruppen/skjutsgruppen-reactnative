import React from 'react';
import PropTypes from 'prop-types';
import Trip from '@components/feed/card/trip';
import Group from '@components/feed/card/group';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';
import ListItem from '@components/search/listItem';
import GroupItem from '@components/search/groupItem';
import PublicTransportItem from '@components/search/publicTransportItem';

const SearchItem = ({ searchResult, onPress, onSharePress, resultsStyle }) => {
  if (resultsStyle === 'list') {
    if (searchResult.url) {
      return (<PublicTransportItem publicTransport={searchResult} />);
    }

    const image = { uri: searchResult.User.avatar };

    if (searchResult.type === FEED_TYPE_WANTED || searchResult.type === FEED_TYPE_OFFER) {
      return (
        <ListItem
          onPress={() => onPress(FEEDABLE_TRIP, searchResult)}
          type={searchResult.type}
          image={image}
          title={`${searchResult.TripStart.name} - ${searchResult.TripEnd.name}`}
          date={searchResult.date}
        />
      );
    }

    return (
      <GroupItem
        onPress={() => onPress(FEEDABLE_GROUP, searchResult)}
        imageURI={searchResult.photo ? searchResult.photo : searchResult.mapPhoto}
        title={searchResult.name}
        colorOverlay={!searchResult.photo}
      />
    );
  }

  if (searchResult.type === FEED_TYPE_WANTED || searchResult.type === FEED_TYPE_OFFER) {
    return (<Trip onPress={onPress} onSharePress={onSharePress} trip={searchResult} />);
  } else if (searchResult.url) {
    return null;
  }

  return (<Group onPress={onPress} onSharePress={onSharePress} group={searchResult} />);
};

SearchItem.propTypes = {
  searchResult: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  resultsStyle: PropTypes.string,
};

SearchItem.defaultProps = {
  resultsStyle: 'card',
};

export default SearchItem;
