import React, { PureComponent } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Detail from '@components/feed/itemDetail';
import {
  CLOSE_GROUP,
  GROUP_FEED_TYPE_JOINED_GROUP,
  FEED_FILTER_WANTED,
  ACTIVITY_TYPE_SHARE_LOCATION_FEED,
  ACTIVITY_TYPE_CREATE_EXPERIENCE,
} from '@config/constant';

import Colors from '@theme/colors';
import FOF from '@components/relation/friendsOfFriend';
import ShareLocation from '@components/feed/shareLocation';
import MakeExperience from '@components/feed/makeExperience';
import { Avatar } from '@components/common';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingVertical: 6,
    marginTop: 16,
  },
  profilePicWrapper: {
    width: 48,
    height: 48,
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 2,
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    right: -2,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
});

class FeedItem extends PureComponent {
  renderProfilePic() {
    const { feed, onPress } = this.props;
    let imgSrc = '';
    let isSupporter = false;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      imgSrc = feed.Enabler.avatar;
      isSupporter = feed.Enabler.isSupporter;
    } else {
      imgSrc = feed.User.avatar;
      isSupporter = feed.User.isSupporter;
    }

    return (
      <View style={styles.profilePicWrapper}>
        <TouchableOpacity onPress={() => {
          if (feed.User.deleted) return null;
          return onPress('Profile', feed.User.id);
        }}
        >
          <Avatar
            notTouchable
            isSupporter={isSupporter}
            size={48}
            imageURI={imgSrc}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        {
          feed.Trip
          &&
          <View
            style={[
              styles.indicator,
              (feed.Trip.type === FEED_FILTER_WANTED) ? styles.blueBg : styles.pinkBg,
            ]}
          />
        }
      </View>
    );
  }

  renderRelation = () => {
    const { feed } = this.props;

    if (feed.User.relation && feed.User.relation.path) {
      return (
        <View style={{ marginLeft: 74 }}>
          <FOF mini relation={feed.User.relation} viewee={feed.User} />
        </View>
      );
    }

    return null;
  }

  render() {
    const { feed, onPress, onLongPress } = this.props;

    if (feed.ActivityType.type === ACTIVITY_TYPE_SHARE_LOCATION_FEED && feed.Trip) {
      if (!feed.Trip.id || !feed.Trip.isParticipant) return null;

      return (
        <ShareLocation
          onPress={onPress}
          detail={feed.Trip}
        />
      );
    }

    if (feed.ActivityType.type === ACTIVITY_TYPE_CREATE_EXPERIENCE && feed.Trip) {
      if (!feed.Trip.id || !feed.Trip.isParticipant) return null;

      return (
        <MakeExperience
          onPress={onPress}
          detail={feed.Trip}
        />);
    }

    return (
      <View>
        <View style={styles.wrapper}>
          {this.renderProfilePic()}
          <Detail
            feed={feed}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        </View>
        {feed.showRelation && this.renderRelation()}
      </View>
    );
  }
}

FeedItem.propTypes = ({
  feed: PropTypes.shape({
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
  onLongPress: PropTypes.func.isRequired,
});

export default FeedItem;
