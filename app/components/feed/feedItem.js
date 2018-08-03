import React from 'react';
import PropTypes from 'prop-types';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  FEEDABLE_NEWS,
  FEEDABLE_EXPERIENCE,
  FEEDABLE_GARDEN,
} from '@config/constant';
import Group from '@components/feed/card/group';
import Trip from '@components/feed/card/trip';
import News from '@components/feed/card/news';
import Experience from '@components/feed/card/experience';
import Supporter from '@components/feed/card/supporter';
import GardenInfo from '@components/feed/card/gardenInfo';

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

  if (feed.feedable === FEEDABLE_GARDEN && feed.User && feed.User.id) {
    return (
      <Supporter
        onPress={() => { }}
        garden={feed.GardenInfo}
        user={feed.User}
      />
    );
  }

  if (feed.feedable === FEEDABLE_GARDEN && !feed.User.id) {
    return (
      <GardenInfo
        onPress={() => { }}
        garden={feed.GardenInfo}
        user={feed.User}
      />
    );
  }

  return null;
};

feedItem.propTypes = {
  feed: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default feedItem;
