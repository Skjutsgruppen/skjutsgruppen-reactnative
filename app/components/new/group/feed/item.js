import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/new/group/feed/default';
import { SharedCard } from '@components/new/common';
import { GROUP_FEED_TYPE_SHARE, FEEDABLE_TRIP, FEED_TYPE_OFFER } from '@config/constant';

const GroupFeedItem = ({ groupFeed, onPress }) => {
  if (groupFeed.ActivityType.type === GROUP_FEED_TYPE_SHARE) {
    if (groupFeed.feedable === FEEDABLE_TRIP) {
      if (groupFeed.Trip.type === FEED_TYPE_OFFER) {
        return (
          <View style={{ marginTop: 12 }} >
            <Feed feed={groupFeed} onPressUser={onPress} />
            <SharedCard
              trip={groupFeed.Trip}
              onPress={onPress}
            />
          </View>
        );
      }

      return (
        <View>
          <Feed feed={groupFeed} onPressUser={onPress} />
          <SharedCard
            trip={groupFeed.Trip}
            onPress={onPress}
          />
        </View>
      );
    }
  }

  return (<Feed feed={groupFeed} onPressUser={onPress} />);
};

GroupFeedItem.propTypes = ({
  groupFeed: PropTypes.shape({
    ActivityType: PropTypes.shape({
      type: PropTypes.string,
    }),
    User: PropTypes.shape({
      id: PropTypes.number,
      photo: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    feedable: PropTypes.string,
    id: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
});

export default GroupFeedItem;
