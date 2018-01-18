import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import {
  GROUP_FEED_TYPE_CREATE_GROUP,
  GROUP_FEED_TYPE_LEFT_GROUP,
  GROUP_FEED_TYPE_JOINED_GROUP,
  GROUP_FEED_TYPE_COMMENT,
  GROUP_FEED_TYPE_SHARE,
  CLOSE_GROUP,
} from '@config/constant';
import RelationBubbleList from '@components/relationBubbleList';

const styles = StyleSheet.create({
  Wrapper: {
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 18,
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
  name: {
    color: '#1db0ed',
    lineHeight: 20,
    fontWeight: 'bold',
    paddingRight: 4,
  },
  commentText: {
    lineHeight: 20,
  },
  time: {
    opacity: 0.6,
    marginTop: 2,
    fontSize: 12,
  },
});

class Feed extends Component {
  renderFeed() {
    const { feed } = this.props;
    if (feed.ActivityType.type === GROUP_FEED_TYPE_CREATE_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>Started the group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>Joined the group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_LEFT_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>Left the group</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT) {
      return (
        <View style={{ width: '100%' }}>
          <Text style={styles.commentText}>{feed.Comment.text}</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_SHARE) {
      return (
        <View>
          <Text style={styles.commentText}>Shared a {feed.feedable} </Text>
        </View>
      );
    }

    return null;
  }

  renderRelation() {
    const { feed, setModalVisibility } = this.props;

    return (
      <View style={{ width: '100%' }}>
        <RelationBubbleList
          users={feed.User.relation}
          avatarSize={24}
          style={{ marginHorizontal: 0 }}
          setModalVisibility={setModalVisibility}
        />
      </View>
    );
  }

  renderClosedGroup() {
    const { feed, onPressUser } = this.props;
    let image = null;

    if (feed.Group.User.avatar) {
      image = (<Image source={{ uri: feed.Group.User.avatar }} style={styles.profilePic} />);
    } else {
      image = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.Wrapper}>
        <TouchableOpacity onPress={() => onPressUser('profile', feed.Group.User.id)}>
          {image}
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.name} onPress={() => onPressUser('profile', feed.Group.User.id)}>{feed.Group.User.firstName || feed.Group.User.email}
            </Text>
            <Text style={styles.commentText}>
              Added <Text style={styles.name} onPress={() => onPressUser('profile', feed.User.id)}>{feed.User.firstName}</Text> to this group
            </Text>
          </View>
          <Text style={styles.time}><Date>{feed.date}</Date></Text>
        </View>
      </View>
    );
  }

  renderOpenGroup() {
    const { feed, onPressUser } = this.props;

    let image = null;
    if (feed.User.avatar) {
      image = (<Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />);
    } else {
      image = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.Wrapper}>
        <TouchableOpacity onPress={() => onPressUser('profile', feed.User.id)}>
          {image}
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.name} onPress={() => onPressUser('profile', feed.User.id)}>{feed.User.firstName || feed.User.email}
            </Text>
            {this.renderFeed()}
          </View>
          <Text style={styles.time}><Date>{feed.date}</Date></Text>
          {this.renderRelation()}
        </View>
      </View>
    );
  }

  render() {
    const { feed } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      return (<View>{this.renderClosedGroup()}</View>);
    }

    return (<View>{this.renderOpenGroup()}</View>);
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
  onPressUser: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
};

export default Feed;
