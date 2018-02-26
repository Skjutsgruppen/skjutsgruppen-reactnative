import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Info from '@components/feed/info';
import { FEEDABLE_TRIP, FEED_FILTER_WANTED } from '@config/constant';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingVertical: 6,
    marginTop: 16,
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
    marginRight: 4,
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

class FeedItem extends PureComponent {
  renderProfilePic() {
    const { feed, onPress } = this.props;

    if (feed.feedable === FEEDABLE_TRIP) {
      return (
        <View style={styles.profilePicWrapper}>
          <TouchableOpacity onPress={() => onPress('Profile', feed.User.id)}>
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

    return (<Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />);
  }

  render() {
    const { feed, onPress, setModalVisibility, onCommentLongPress } = this.props;

    return (
      <View style={styles.wrapper}>
        {this.renderProfilePic()}
        <Info
          feed={feed}
          onPress={onPress}
          setModalVisibility={setModalVisibility}
          onCommentLongPress={onCommentLongPress}
        />
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
  setModalVisibility: PropTypes.func.isRequired,
  onCommentLongPress: PropTypes.func.isRequired,
});

export default FeedItem;
