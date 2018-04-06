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
  FEEDABLE_SUGGESTION,
  GROUP_FEED_TYPE_OFFER_RIDE,
  GROUP_FEED_TYPE_ENABLER_ADDED,
  GROUP_FEED_TYPE_UPDATED,
} from '@config/constant';
import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { SharedCard } from '@components/common';
import { connect } from 'react-redux';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapFlex: {
    flex: 1,
    paddingLeft: 12,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 6,
    paddingRight: 20,
    marginTop: 4,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 2,
    marginHorizontal: 6,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  commentText: {
    lineHeight: 20,
  },
  time: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.text.gray,
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
    const { feed, onPress, onLongPress, user } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_CREATE_GROUP) {
      return (
        <View style={styles.wrapFlex}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} Started the group
          </AppText>
          <AppText style={styles.time}>
            <Date calendarTime>{feed.date}</Date>
          </AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP) {
      return (
        <View style={styles.wrapFlex}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} Joined the group
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_LEFT_GROUP) {
      return (
        <View style={styles.wrapFlex}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} Left the group
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT) {
      return (
        <View>
          <TouchableHighlight
            onLongPress={() => onLongPress({
              isOwner: (feed.User.id === user.id),
              data: feed,
              type: GROUP_FEED_TYPE_COMMENT,
            })}
            style={styles.wrapFlex}
          >
            <View>
              <AppText style={styles.commentText}>
                {this.renderUsername()} <AppText style={styles.time}>
                  <Date calendarTime>{feed.date}</Date>
                </AppText>
              </AppText>
              <AppText style={styles.commentText}>{feed.Comment.text}</AppText>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_SHARE) {
      return (
        <TouchableHighlight
          onLongPress={() => onLongPress({
            isOwner: (feed.User.id === user.id),
            data: feed,
            type: GROUP_FEED_TYPE_SHARE,
          })}
        >
          {this.renderSharedCard()}
        </TouchableHighlight>
      );
    }

    if (feed.feedable === FEEDABLE_SUGGESTION) {
      return (
        <TouchableHighlight
          onLongPress={() => onLongPress({
            isOwner: (feed.User.id === user.id),
            data: feed,
            type: FEEDABLE_SUGGESTION,
          })}
          style={styles.wrapFlex}
        >
          <View>
            {this.renderSuggestedText(feed)}
            {feed.Trip.id &&
              <SharedCard
                trip={feed.Trip}
                onPress={onPress}
                date={feed.date}
              />
            }
          </View>
        </TouchableHighlight>
      );
    }

    if (feed.feedable === FEEDABLE_EXPERIENCE) {
      return (
        <TouchableHighlight
          onLongPress={() => onLongPress({
            isOwner: (feed.User.id === user.id),
            data: feed,
            type: FEEDABLE_EXPERIENCE,
          })}
          style={styles.wrapFlex}
        >
          {this.renderExperience(feed, onPress)}
        </TouchableHighlight>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_ENABLER_ADDED) {
      return (
        <View style={styles.wrapFlex}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} is now enabler
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_UPDATED) {
      return (
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} has updated the {feed.updatedField} of the group
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    return null;
  }

  renderSuggestedText = (feed) => {
    if (feed.ActivityType.type === GROUP_FEED_TYPE_OFFER_RIDE) {
      return (
        <View style={styles.wrapFlex}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} offers a ride:
          </AppText>
          <AppText>{feed.Trip.description}</AppText>
        </View>
      );
    }

    return (
      <View style={styles.wrapFlex}>
        <AppText style={styles.commentText}>
          {this.renderUsername()} suggests {this.renderUsername(feed.Trip.User)} ride:
        </AppText>
        <AppText>{feed.Suggestion.text}</AppText>
      </View>
    );
  }

  renderClosedGroup() {
    const { feed, onPress } = this.props;

    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.title}>
            <AppText color={Colors.text.blue} fontVariation="semibold" onPress={() => onPress('Profile', feed.Enabler.id)}>
              {`${feed.Enabler.firstName} `}
            </AppText>
            <Text style={styles.commentText}>
              Added <Text color={Colors.text.blue} fontVariation="semibold" onPress={() => onPress('Profile', feed.User.id)}>{feed.User.firstName}</Text> to this group
            </Text>
          </View>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      </View>
    );
  }

  renderUsername = (user = null) => {
    const { feed, onPress } = this.props;
    const userDetail = user || feed.User;

    return (
      <AppText color={Colors.text.blue} fontVariation="semibold" onPress={() => onPress('Profile', userDetail.id)}>
        {userDetail.firstName}
      </AppText>
    );
  }

  renderSharedCard() {
    const { feed, onPress } = this.props;

    if (feed.feedable === FEEDABLE_TRIP) {
      if (feed.Trip.User.id === feed.User.id) {
        return (
          <View style={styles.content}>
            <AppText style={styles.commentText}>
              {this.renderUsername()} <AppText>{feed.Trip.type === FEED_FILTER_WANTED ? 'asks for a ride' : 'offers a ride'}</AppText>
            </AppText>
            <AppText>{feed.Trip.description}</AppText>
            <SharedCard
              trip={feed.Trip}
              onPress={onPress}
              date={feed.date}
            />
          </View>
        );
      }

      return (
        <View style={styles.content}>
          <AppText style={styles.commentText}>
            {this.renderUsername()} <AppText>shared <AppText color={Colors.text.blue} fontVariation="semibold">{`${feed.Trip.User.firstName}'s`}</AppText> {feed.feedable === FEEDABLE_TRIP ? 'ride' : feed.feedable}: </AppText>
          </AppText>
          <SharedCard
            trip={feed.Trip}
            onPress={onPress}
            date={feed.date}
          />
        </View>
      );
    }

    if (feed.feedable === FEEDABLE_EXPERIENCE) {
      return this.renderExperience(feed, onPress);
    }

    return null;
  }

  renderExperience = (feed, onPress) => {
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
        <AppText key={i}>{separator}
          <AppText color={Colors.text.blue} fontVariation="semibold">{participant.User.firstName}</AppText>
        </AppText>
      );
    });

    return (
      <View style={styles.wrapFlex}>
        <AppText>
          {participants} had an Experience <AppText style={styles.time}>
            <Date calendarTime>{feed.date}</Date></AppText>
        </AppText>
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

  renderDescription() {
    return (
      <View style={styles.Wrapper}>
        {this.renderFeed()}
      </View>
    );
  }

  render() {
    const { feed } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      return this.renderClosedGroup();
    }

    return this.renderDescription();
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
  onLongPress: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Feed);
