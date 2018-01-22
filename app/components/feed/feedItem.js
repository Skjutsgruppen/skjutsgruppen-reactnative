import React from 'react';
import PropTypes from 'prop-types';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  FEEDABLE_NEWS,
  FEEDABLE_EXPERIENCE,
} from '@config/constant';
import Group from '@components/feed/card/group';
import Trip from '@components/feed/card/trip';
import News from '@components/feed/card/news';
import Experience from '@components/feed/card/experience';

const feedItem = ({ feed, onPress, onSharePress }) => {
  if (feed.feedable === FEEDABLE_TRIP) {
    return (
      <Trip
        onPress={onPress}
        onSharePress={onSharePress}
        trip={feed.Trip}
      />
    );
  }

  if (feed.feedable === FEEDABLE_GROUP) {
    return (
      <Group
        onPress={onPress}
        onSharePress={onSharePress}
        group={feed.Group}
      />
    );
  }

  if (feed.feedable === FEEDABLE_NEWS) {
    return (
      <News
        onPress={onPress}
        onSharePress={onSharePress}
        news={feed.News}
      />
    );
  }

  if (feed.feedable === FEEDABLE_EXPERIENCE) {
    return (
      <Experience
        onPress={onPress}
        onSharePress={onSharePress}
        experience={feed.Experience}
      />
    );
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
