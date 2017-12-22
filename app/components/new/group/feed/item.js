import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/new/group/feed/default';
import Offer from '@components/feed/card/offer';
import Ask from '@components/feed/card/ask';
import { SharedCard } from '@components/new/common';
import Colors from '@theme/colors';
import Date from '@components/date';

const styles = StyleSheet.create({
  Wrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  singleCard: {
    marginTop: 12,
    marginBottom: 12,
  },
  sharedCard: {
    marginBottom: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 18,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
    paddingRight: 4,
  },
  time: {
    color: '#777777',
    marginTop: 2,
  },
  filler: {
    padding: 12,
    color: '#999',
  },
});

const GroupFeedItem = ({ groupFeed, onPress }) => {
  if (groupFeed.ActivityType.type === 'share') {
    if (groupFeed.feedable === 'Trip') {
      if (groupFeed.Trip.type === 'offered') {
        return (
          <View style={{
            marginTop: 12,
          }}
          >
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
  onSharePress: PropTypes.func.isRequired,
});

export default GroupFeedItem;
