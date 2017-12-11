import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/group/feed/default';
import Offer from '@components/feed/card/offer';
import Ask from '@components/feed/card/ask';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  Wrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    marginRight: 6,
    marginLeft: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
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
    height: 55,
    width: 55,
    borderRadius: 28,
    // marginRight: 12,
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

const GroupFeedItem = ({ groupFeed, onPress, onSharePress }) => {
  if (groupFeed.ActivityType.type === 'ask_ride') {
    return (
      <Ask
        ask={groupFeed.Trip}
        onPress={onPress}
        onSharePress={onSharePress}
        wrapperStyle={styles.card}
      />
    );
  } else if (groupFeed.ActivityType.type === 'offer_ride') {
    return (
      <Offer
        offer={groupFeed.Trip}
        onPress={onPress}
        onSharePress={onSharePress}
        wrapperStyle={styles.card}
      />
    );
  } else if (groupFeed.ActivityType.type === 'share') {
    if (groupFeed.feedable === 'Trip') {
      let image = null;
      if (groupFeed.User.photo) {
        image = (<Image source={{ uri: groupFeed.User.photo }} style={styles.profilePic} />);
      } else {
        image = (<View style={styles.imgIcon} />);
      }

      const user = (
        <View style={styles.Wrapper}>
          <TouchableOpacity onPress={() => onPress('profile', groupFeed.User.id)}>{image}</TouchableOpacity>
          <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Text style={styles.name}>{groupFeed.User.firstName || groupFeed.User.email}</Text>
              <Text>shared a trip</Text>
            </View>
            <Text style={styles.time}>{groupFeed.date}</Text>
          </View>
        </View>
      );

      if (groupFeed.Trip.type === 'offered') {
        return (
          <View style={{
            marginTop: 12,
          }}
          >
            {user}
            <Offer
              offer={groupFeed.Trip}
              onPress={onPress}
              onSharePress={onSharePress}
              wrapperStyle={styles.sharedCard}
            />
          </View>
        );
      }

      return (
        <View>
          {user}
          <Ask
            ask={groupFeed.Trip}
            onPress={onPress}
            onSharePress={onSharePress}
            wrapperStyle={styles.sharedCard}
          />
        </View>
      );
    }
  }

  return (<Feed feed={groupFeed} onPress={onPress} />);
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
