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
  FEED_FILTER_WANTED,
  FEEDABLE_TRIP,
  FEEDABLE_EXPERIENCE,
} from '@config/constant';
import RelationBubbleList from '@components/relationBubbleList';
import Colors from '@theme/colors';
import { SharedCard } from '@components/common';

const styles = StyleSheet.create({
  Wrapper: {
    flex: 1,
    maxWidth: 300,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 16,
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
  },
  commentText: {
    lineHeight: 20,
  },
  time: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.text.gray,
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    right: 16,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  profilePicWrapper: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  experience: {
    width: 220,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});

class Feed extends Component {
  renderFeed() {
    const { feed } = this.props;
    if (feed.ActivityType.type === GROUP_FEED_TYPE_CREATE_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>
            {this.renderUsername()} Started the group
          </Text>
          <Text style={styles.time}><Date calendarTime>{feed.date}</Date></Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>
            {this.renderUsername()} Joined the group
          </Text>
          <Text style={styles.time}><Date calendarTime>{feed.date}</Date></Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_LEFT_GROUP) {
      return (
        <View>
          <Text style={styles.commentText}>
            {this.renderUsername()} Left the group
          </Text>
          <Text style={styles.time}><Date calendarTime>{feed.date}</Date></Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT) {
      return (
        <View>
          <Text style={styles.commentText}>
            {this.renderUsername()}
            <Text style={styles.time}><Date calendarTime>{feed.date}</Date></Text>
          </Text>
          <Text style={styles.commentText}>{feed.Comment.text}</Text>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_SHARE) {
      return this.renderSharedCard();
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

  renderProfilePic() {
    const { feed } = this.props;

    if (feed.feedable === FEEDABLE_TRIP) {
      return (
        <View>
          <Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />
          <View
            style={[
              styles.indicator,
              (feed.Trip.type === FEED_FILTER_WANTED) ? styles.blueBg : styles.pinkBg,
            ]}
          />
        </View>
      );
    }

    return (<Image source={{ uri: feed.User.avatar }} style={styles.profilePic} />);
  }

  renderClosedGroup() {
    const { feed, onPress } = this.props;
    let image = null;

    if (feed.Group.User.avatar) {
      image = this.renderProfilePic();
    } else {
      image = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.Wrapper}>
        <TouchableOpacity onPress={() => onPress('Profile', feed.Group.User.id)}>
          {image}
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.name} onPress={() => onPress('Profile', feed.Group.User.id)}>
              {feed.Group.User.firstName}
            </Text>
            <Text style={styles.commentText}>
              Added <Text style={styles.name} onPress={() => onPress('Profile', feed.User.id)}>{feed.User.firstName}</Text> to this group
            </Text>
          </View>
          <Text style={styles.time}><Date calendarTime>{feed.date}</Date></Text>
        </View>
      </View>
    );
  }

  renderUsername = () => {
    const { feed, onPress } = this.props;

    return (
      <Text style={styles.name} onPress={() => onPress('Profile', feed.User.id)}>
        {feed.User.firstName}
      </Text>
    );
  }

  renderSharedCard() {
    const { feed, onPress } = this.props;

    if (feed.feedable === FEEDABLE_TRIP) {
      if (feed.Trip.User.id === feed.User.id) {
        return (
          <View>
            <Text style={styles.commentText}>
              {this.renderUsername()} <Text style={styles.commentText}>{feed.Trip.type === FEED_FILTER_WANTED ? 'asks for a ride' : 'offers a ride'}</Text>
            </Text>
            <Text>{feed.Trip.description}</Text>
            <SharedCard
              trip={feed.Trip}
              onPress={onPress}
              date={feed.date}
            />
          </View>
        );
      }

      return (
        <View>
          <Text style={styles.commentText}>
            {this.renderUsername()} <Text style={styles.commentText}>shared <Text style={styles.name}>{`${feed.Trip.User.firstName}'s`}</Text> {feed.feedable === FEEDABLE_TRIP ? 'ride' : feed.feedable}: </Text>
          </Text>
          <SharedCard
            trip={feed.Trip}
            onPress={onPress}
            date={feed.date}
          />
        </View>
      );
    }

    if (feed.feedable === FEEDABLE_EXPERIENCE) {
      let i = 1;
      const participants = feed.Experience.Participants.map((participant, index) => {
        let separator = '';
        i += 1;
        if (index === feed.Experience.Participants.length - 1) {
          separator = ' and ';
        } else if (index !== 0) {
          separator = ', ';
        }
        return (
          <Text key={i}>{separator}
            <Text style={styles.name}>{participant.User.firstName}</Text>
          </Text>
        );
      });
      return (
        <View>
          <Text>
            {participants} had an Experience <Text style={styles.time}>
              <Date calendarTime>{feed.date}</Date></Text>
          </Text>
          <View style={styles.experience}>
            <TouchableOpacity
              key={feed.Experience.id}
              onPress={() => onPress(FEEDABLE_EXPERIENCE, feed.Experience)}
            >
              <Image source={{ uri: feed.Experience.photoUrl }} style={styles.image} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  }

  renderOpenGroup() {
    return (
      <View style={styles.Wrapper}>
        {this.renderFeed()}
        {false && this.renderRelation()}
      </View>
    );
  }

  render() {
    const { feed } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      return this.renderClosedGroup();
    }

    return this.renderOpenGroup();
  }
}

Feed.propTypes = {
  feed: PropTypes.shape({
    ActivityType: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    User: PropTypes.shape({
      firstName: PropTypes.string,
    }),
    date: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
};

export default Feed;
