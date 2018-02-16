import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/group/feed/default';
import { FEEDABLE_TRIP, FEED_FILTER_WANTED } from '@config/constant';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingVertical: 16,
  },
  profilePicWrapper: {
    width: 48,
    height: 48,
    marginRight: 14,
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 14,
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
  commentText: {
    lineHeight: 20,
    alignItems: 'flex-end',
  },
  time: {
    maxWidth: 300,
    textAlign: 'right',
    color: Colors.text.gray,
  },
});

class GroupFeedItem extends PureComponent {
  renderProfilePic() {
    const { groupFeed, onPress } = this.props;

    if (groupFeed.feedable === FEEDABLE_TRIP) {
      return (
        <View style={styles.profilePicWrapper}>
          <TouchableOpacity onPress={() => onPress('Profile', groupFeed.User.id)}>
            <Image source={{ uri: groupFeed.User.avatar }} style={styles.profilePic} />
          </TouchableOpacity>
          <View
            style={[
              styles.indicator,
              (groupFeed.Trip.type === FEED_FILTER_WANTED) ? styles.blueBg : styles.pinkBg,
            ]}
          />
        </View>
      );
    }

    return (<Image source={{ uri: groupFeed.User.avatar }} style={styles.profilePic} />);
  }

  render() {
    const { groupFeed, onPress, setModalVisibility } = this.props;

    return (
      <View style={styles.wrapper}>
        {this.renderProfilePic()}
        <Feed
          feed={groupFeed}
          onPress={onPress}
          setModalVisibility={setModalVisibility}
        />
      </View>
    );
  }
}

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
