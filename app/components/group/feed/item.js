import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/group/feed/default';
import { SharedCard } from '@components/common';
import { GROUP_FEED_TYPE_SHARE, FEEDABLE_TRIP, FEEDABLE_EXPERIENCE } from '@config/constant';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 60,
    marginBottom: 8,
  },
  experience: {
    width: 250,
    margin: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.15,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});

const GroupFeedItem = ({ groupFeed, onPress, setModalVisibility }) => {
  const defaultText = (
    <Feed
      feed={groupFeed}
      onPressUser={onPress}
      setModalVisibility={setModalVisibility}
    />
  );

  if (groupFeed.ActivityType.type !== GROUP_FEED_TYPE_SHARE) {
    return defaultText;
  }

  if (groupFeed.feedable === FEEDABLE_TRIP) {
    return (
      <View>
        {defaultText}
        <SharedCard
          trip={groupFeed.Trip}
          onPress={onPress}
        />
      </View>
    );
  }

  if (groupFeed.feedable === FEEDABLE_EXPERIENCE) {
    return (
      <View>
        <Feed feed={groupFeed} onPressUser={onPress} setModalVisibility={setModalVisibility} />
        <View style={styles.wrapper}>
          <TouchableOpacity
            key={groupFeed.Experience.id}
            onPress={() => onPress(FEEDABLE_EXPERIENCE, groupFeed.Experience)}
            style={styles.experience}
          >
            <Image source={{ uri: groupFeed.Experience.photo }} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

GroupFeedItem.propTypes = ({
  groupFeed: PropTypes.shape({
    ActivityType: PropTypes.shape({
      type: PropTypes.string,
    }),
    User: PropTypes.shape({
      avatar: PropTypes.string,
      firstName: PropTypes.string,
    }).isRequired,
    feedable: PropTypes.string,
    id: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
});

export default GroupFeedItem;
