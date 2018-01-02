import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import {
  NOTIFICATION_TYPE_CREATE_GROUP,
  NOTIFICATION_TYPE_LEFT_GROUP,
  NOTIFICATION_TYPE_JOINED_GROUP,
  NOTIFICATION_TYPE_COMMENT,
} from '@config/constant';

const styles = StyleSheet.create({
  Wrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 28,
    marginRight: 12,
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

class Feed extends Component {
  renderFeed() {
    const { feed } = this.props;
    if (feed.ActivityType.type === NOTIFICATION_TYPE_CREATE_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>Created this group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === NOTIFICATION_TYPE_LEFT_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>left the group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === NOTIFICATION_TYPE_JOINED_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>Joined the group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === NOTIFICATION_TYPE_COMMENT) {
      return (
        <View>
          <Text style={styles.commentText}>{feed.Comment.text}</Text>
        </View>
      );
    }

    return null;
  }

  render() {
    const { feed, onPress } = this.props;

    let image = null;
    if (feed.User.avatar) {
      image = (<Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />);
    } else {
      image = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.Wrapper}>
        <TouchableOpacity onPress={() => onPress('profile', feed.User.id)}>{image}</TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Text style={styles.name}>{feed.User.firstName || feed.User.email}</Text>
            <Text style={styles.time}><Date>{feed.date}</Date></Text>
          </View>
          {this.renderFeed()}
        </View>
      </View>
    );
  }
}

Feed.propTypes = {
  feed: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
      date: PropTypes.string,
    }),
    date: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Feed;
