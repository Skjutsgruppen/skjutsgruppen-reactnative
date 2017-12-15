import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

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
    if (feed.ActivityType.type === 'create_group') {
      return (
        <View>
          <Text style={styles.commentText}>Created this group</Text>
        </View>
      );
    } else if (feed.ActivityType.type === 'joined_group') {
      return (
        <View>
          <Text style={styles.commentText}>Joined the group</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.commentText}>{feed.Comment.text}</Text>
      </View>
    );
  }

  render() {
    const { feed, onPress } = this.props;

    let image = null;
    if (feed.User.photo) {
      image = (<Image source={{ uri: feed.User.photo }} style={styles.profilePic} />);
    } else {
      image = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.Wrapper}>
        <TouchableOpacity onPress={() => onPress('profile', feed.User.id)}>{image}</TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Text style={styles.name}>{feed.User.firstName || feed.User.email}</Text>
            <Text style={styles.time}>{feed.date}</Text>
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
