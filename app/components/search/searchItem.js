import React from 'react';
import PropTypes from 'prop-types';
import Trip from '@components/feed/card/trip';
import Group from '@components/feed/card/group';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';
import ListItem from '@components/search/listItem';
import GroupItem from '@components/search/groupItem';
import PublicTransportItem from '@components/search/publicTransportItem';
import { UcFirst } from '@config';

const SearchItem = ({ searchResult, onPress, onSharePress, resultsStyle, displayGroup }) => {
  if (resultsStyle === 'list') {
    if (searchResult.url) {
      return (<PublicTransportItem publicTransport={searchResult} />);
    }

    const image = searchResult.User.avatar;
    const isSupporter = searchResult.User.isSupporter;
    const startPlace = searchResult.TripStart.name || UcFirst(searchResult.direction);
    const endPlace = searchResult.TripEnd.name || UcFirst(searchResult.direction);

    if (searchResult.type === FEED_TYPE_WANTED || searchResult.type === FEED_TYPE_OFFER) {
      return (
        <ListItem
          onPress={() => onPress(FEEDABLE_TRIP, searchResult)}
          type={searchResult.type}
          image={image}
          isSupporter={isSupporter}
          title={`${startPlace} - ${endPlace}`}
          date={searchResult.date}
        />
      );
    }

    if (displayGroup) {
      return (
        <GroupItem
          onPress={() => onPress(FEEDABLE_GROUP, searchResult)}
          imageURI={searchResult.photo ? searchResult.photo : searchResult.mapPhoto}
          title={searchResult.name}
          colorOverlay={!searchResult.photo}
        />
      );
    }

    return null;
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
  displayGroup: PropTypes.bool,
};

SearchItem.defaultProps = {
  resultsStyle: 'card',
  displayGroup: false,
};

export default SearchItem;
