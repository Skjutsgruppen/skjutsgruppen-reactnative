import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Detail from '@components/feed/itemDetail';
import {
  CLOSE_GROUP,
  GROUP_FEED_TYPE_JOINED_GROUP,
  FEEDABLE_TRIP,
  FEED_FILTER_WANTED,
} from '@config/constant';
import Colors from '@theme/colors';
import FOF from '@components/relation/friendsOfFriend';


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
    marginRight: 8,
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
    if (feed.feedable === FEEDABLE_TRIP) {
      return (
        <View style={styles.profilePicWrapper}>
          <TouchableOpacity onPress={() => {
            if (feed.User.deleted) return null;
            return onPress('Profile', feed.User.id);
          }}
          >
            <Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />
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

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      return (<Image source={{ uri: feed.Enabler.avatar }} style={styles.profilePic} />);
    }

    return (<Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />);
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
