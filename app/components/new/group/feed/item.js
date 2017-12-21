import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/new/group/feed/default';
import { SharedCard } from '@components/new/common';

const GroupFeedItem = ({ groupFeed, onPress }) => {
  if (groupFeed.ActivityType.type === 'share') {
    if (groupFeed.feedable === 'Trip') {
      if (groupFeed.Trip.type === 'offered') {
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
