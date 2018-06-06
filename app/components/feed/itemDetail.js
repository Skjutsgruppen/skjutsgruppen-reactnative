import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';
import Marker from '@components/map/marker';
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
  LOCATION_SHARED,
  GROUP_FEED_TYPE_LOCATION_SHARING_STOPPED,
  FEEDABLE_LOCATION,
} from '@config/constant';
import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { SharedCard } from '@components/common';
import { AppText } from '@components/utils/texts';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  details: {
    flex: 1,
    paddingHorizontal: 16,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 20,
    marginTop: 4,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 2,
    paddingLeft: 8,
    paddingRight: 20,
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
    marginHorizontal: 6,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 4,
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
  sharedLocationCard: {
    marginTop: 16,
    marginBottom: 6,
    marginHorizontal: 6,
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.background.mutedBlue,
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  map: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapFeedContainer: {
    height: 150,
    width: '100%',
  },
});

class Feed extends Component {
  renderFeed() {
    const { feed, onPress, onLongPress, user } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_CREATE_GROUP) {
      return (
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.user_started_the_group')}
          </AppText>
          <AppText style={styles.time}>
            <Date calendarTime>{feed.date}</Date>
          </AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP) {
      return (
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.user_joined_the_group')}
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_LEFT_GROUP) {
      return (
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.user_left_the_group')}
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_COMMENT) {
      return (
        <TouchableHighlight
          onLongPress={() => onLongPress({
            isOwner: (feed.User.id === user.id),
            data: feed,
            type: GROUP_FEED_TYPE_COMMENT,
          })}
        >
          <View>
            <AppText style={styles.commentText}>
              {this.renderUsername()} <AppText style={styles.time}>
                <Date calendarTime>{feed.date}</Date>
              </AppText>
            </AppText>
            {feed.Comment && feed.Comment.text &&
              <AppText style={styles.commentText}>{feed.Comment.text}</AppText>}
          </View>
        </TouchableHighlight>
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
        >
          {this.renderExperience(feed, onPress)}
        </TouchableHighlight>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_ENABLER_ADDED) {
      return (
        <View >
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.user_is_now_enabler')}
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_UPDATED) {
      return (
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.user_has_updated_field_of_group', { field: feed.updatedField })}
          </AppText>
          <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === GROUP_FEED_TYPE_LOCATION_SHARING_STOPPED) {
      return (
        <View >
          <AppText>
            <AppText color={Colors.text.blue} fontVariation="semibold">{this.renderUsername()}</AppText> {trans('detail.user_has_stopped_sharing_location')}
          </AppText>
          <AppText size={12} color={Colors.text.gray}>
            <Date calendarTime>{feed.date}</Date></AppText>
        </View>
      );
    }

    if (feed.ActivityType.type === LOCATION_SHARED && feed.Location) {
      const coordinates = {
        latitude: feed.Location.locationCoordinates[1],
        longitude: feed.Location.locationCoordinates[0],
      };

      return (
        <View>
          <AppText>
            <AppText color={Colors.text.blue} fontVariation="semibold">{this.renderUsername()}</AppText> {trans('detail.user_shares_location')}
          </AppText>
          <View style={styles.sharedLocationCard}>
            <View style={styles.map}>
              <MapView
                style={styles.mapFeedContainer}
                region={{
                  longitude: coordinates.longitude,
                  latitude: coordinates.latitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                liteMode
                showsUserLocation
                onPress={() => onPress(FEEDABLE_LOCATION, {})}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  onPress={() => { }}
                  coordinate={coordinates}
                  image={feed.User.avatar}
                />
              </MapView>
            </View>
            {feed.Location.duration > 0 &&
              <AppText style={{ color: Colors.text.blue, fontWeight: 'bold', textAlign: 'right', marginTop: 6 }}>
                {feed.Location.duration} {trans('detail.more_minutes')}
              </AppText>}
          </View>
          <AppText size={12} color={Colors.text.gray} style={{ textAlign: 'right' }} >
            <Date format={'dddd HH:mm'}>{feed.Location.sharedFrom}</Date></AppText>
        </View>
      );
    }

    return null;
  }

  renderSuggestedText = (feed) => {
    if (feed.ActivityType.type === GROUP_FEED_TYPE_OFFER_RIDE) {
      return (
        <View >
          <AppText style={styles.commentText}>
            {this.renderUsername()} {trans('detail.offers_a_ride')}
          </AppText>
          <AppText>{feed.Trip.description}</AppText>
        </View>
      );
    }

    return (
      <View >
        <AppText style={styles.commentText}>
          {this.renderUsername()} {trans('detail.suggests')} {this.renderUsername(feed.Trip.User)}{trans('detail.user_s_ride')}
        </AppText>
        <AppText>{feed.Suggestion.text}</AppText>
      </View>
    );
  }

  renderClosedGroup() {
    const { feed, onPress } = this.props;

    return (
      <View>
        <View style={styles.title}>
          <AppText color={Colors.text.blue} fontVariation="semibold" onPress={() => onPress('Profile', { id: feed.Enabler.id })}>
            {`${feed.Enabler.firstName} `}
          </AppText>
          <AppText style={styles.commentText}>
            {trans('detail.added')} <AppText color={Colors.text.blue} fontVariation="semibold" onPress={() => onPress('Profile', { id: feed.User.id })}>{feed.User.firstName}</AppText> {trans('detail.to_this_group')}
          </AppText>
        </View>
        <AppText style={styles.time}><Date calendarTime>{feed.date}</Date></AppText>
      </View>
    );
  }

  renderUsername = (user = null) => {
    const { feed, onPress } = this.props;
    const userDetail = user || feed.User;

    return (
      <AppText
        color={userDetail.deleted ? null : Colors.text.blue}
        fontVariation="semibold"
        onPress={() => {
          if (userDetail.deleted) return null;
          return onPress('Profile', { id: userDetail.id });
        }}
      >
        {userDetail.firstName}
      </AppText>
    );
  }

  renderSharedCard() {
    const { feed, onPress } = this.props;

    if (feed.feedable === FEEDABLE_TRIP) {
      if (feed.Trip.User.id === feed.User.id) {
        return (
          <View>
            <AppText style={styles.commentText}>
              {this.renderUsername()} <AppText>{feed.Trip.type === FEED_FILTER_WANTED ? trans('feed.asks_for_a_ride') : trans('detail.offers_a_ride')}</AppText>
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
        <View>
          <AppText style={styles.commentText}>
            {this.renderUsername()} <AppText>{trans('detail.shared')} <AppText color={Colors.text.blue} fontVariation="semibold">{trans('detail.user_s', { user: feed.Trip.User.firstName })}</AppText> {feed.feedable === FEEDABLE_TRIP ? trans('detail.ride') : feed.feedable}: </AppText>
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
        separator = ` ${trans('global._and_')} `;
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
      <View >
        <AppText>
          {participants} {trans('detail.user_had_an_experience')} <AppText style={styles.time}>
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

  render() {
    const { feed } = this.props;

    if (feed.ActivityType.type === GROUP_FEED_TYPE_JOINED_GROUP
      && feed.Group.type === CLOSE_GROUP) {
      return <View style={styles.details}>{this.renderClosedGroup()}</View>;
    }

    return <View style={styles.details}>{this.renderFeed()}</View>;
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
