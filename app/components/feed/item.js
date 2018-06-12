import React, { PureComponent } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Detail from '@components/feed/itemDetail';
import {
  GROUP_FEED_TYPE_JOINED_GROUP,
  FEED_FILTER_WANTED,
  ACTIVITY_TYPE_SHARE_LOCATION_FEED,
  ACTIVITY_TYPE_CREATE_EXPERIENCE,
  EXPERIENCE_STATUS_CAN_CREATE,
  FEEDABLE_GROUP,
  GROUP_FEED_TYPE_COMMENT,
  SHARE_EXPERIENCE_DEFAULT_MINUTE,
} from '@config/constant';

import Colors from '@theme/colors';
import FOF from '@components/relation/friendsOfFriend';
import ShareLocation from '@components/feed/shareLocation';
import MakeExperience from '@components/feed/makeExperience';
import { getDate } from '@config';
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
  isTripStartedForShareLocation = () => {
    const { feed: { Trip: trip } } = this.props;
    return getDate(trip.date).subtract(40, 'minute').isBefore();
  }

  isTripStarted = () => {
    const { feed: { Trip: trip } } = this.props;

    return getDate(trip.date).add(SHARE_EXPERIENCE_DEFAULT_MINUTE, 'minute').isBefore();
  }

  isTripEnded = () => {
    const { feed: { Trip: trip } } = this.props;

    return getDate(trip.date)
      .add(trip.duration, 'second')
      .add(1, 'day')
      .isBefore();
  }

  canShareLocation = () => {
    const { feed: { Trip: trip } } = this.props;
    const { Participants, isParticipant } = trip;


    if ((Participants && Participants.count <= 1) || !isParticipant) {
      return false;
    }

    if (!this.isTripStartedForShareLocation()) {
      return false;
    }

    if (this.isTripEnded()) {
      return false;
    }

    return true;
  }

  canCreateExperience = () => {
    const { feed: { Trip: trip } } = this.props;
    const { experienceStatus, Participants, isParticipant } = trip;

    if (experienceStatus) {
      return (
        Participants.count > 1
        && isParticipant
        && experienceStatus === EXPERIENCE_STATUS_CAN_CREATE
      );
    }

    return false;
  }

  renderProfilePic() {
    const { feed, onPress } = this.props;
    let imgSrc = '';
    let userId = feed.User.id;
    let isSupporter = false;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT
      && feed.Comment && feed.Comment.isBlocked) {
      return null;
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && Object.keys(feed.Enabler).length > 0 && feed.Enabler.avatar) {
      imgSrc = feed.Enabler.avatar;
      userId = feed.Enabler.id;
      isSupporter = feed.Enabler.isSupporter;
    } else {
      imgSrc = feed.User.avatar;
      isSupporter = feed.User.isSupporter;
    }

    return (
      <View style={styles.profilePicWrapper}>
        <TouchableOpacity onPress={() => {
          if (feed.User.deleted) return null;
          return onPress('Profile', { id: userId });
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
    const { feed, type } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT
      && feed.Comment && feed.Comment.isBlocked) {
      return null;
    }

    if (feed.User.relation && feed.User.relation.path) {
      return (
        <View style={{ marginLeft: 74 }}>
          <FOF
            mini
            relation={feed.User.relation}
            viewee={feed.User}
            displayNoConnection={type === FEEDABLE_GROUP}
          />
        </View>
      );
    }

    return null;
  }

  render() {
    const { feed, onPress, onLongPress } = this.props;

    if (feed.ActivityType.type === ACTIVITY_TYPE_SHARE_LOCATION_FEED && feed.Trip) {
      if (!this.canShareLocation()) {
        return null;
      }

      return (
        <ShareLocation
          onPress={onPress}
          detail={feed.Trip}
        />
      );
    }

    if (feed.ActivityType.type === ACTIVITY_TYPE_CREATE_EXPERIENCE && feed.Trip) {
      if (this.canCreateExperience() && this.isTripStarted() && !this.isTripEnded()) {
        return (
          <MakeExperience
            onPress={onPress}
            detail={feed.Trip}
          />);
      }

      return null;
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
  type: PropTypes.string.isRequired,
});

export default FeedItem;
