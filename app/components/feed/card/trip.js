import React from 'react';
import { StyleSheet, View, Text, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Gradients } from '@theme';
import { TripTypePill, TripImage, Footer } from '@components/feed/card';
import Date from '@components/date';
import { trans } from '@lang/i18n';
import { FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED, FLEXIBILITY_EARLIER_TYPE } from '@config/constant';
import TouchableHighlight from '@components/touchableHighlight';
import LinearGradient from 'react-native-linear-gradient';

const cardHeight = 484;
const profilePicSize = 60;

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 4,
  },
  groupName: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
  },
  profilePicWrapper: {
    height: profilePicSize,
    width: profilePicSize,
    position: 'absolute',
    top: (cardHeight * 0.48) - (profilePicSize / 2),
    right: 20,
    zIndex: 10,
  },
  profilePic: {
    height: profilePicSize,
    width: profilePicSize,
    resizeMode: 'cover',
    borderRadius: (profilePicSize / 2),
    borderWidth: 2,
    borderColor: Colors.border.white,
  },
  detail: {
    paddingHorizontal: 18,
    paddingTop: 20,
    marginBottom: 20,
  },
  comment: {
    flex: 1,
    flexBasis: 50,
    minHeight: 50,
    paddingHorizontal: 18,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  commentGradientOverlay: {
    height: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  text: {
    lineHeight: 20,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

const Trip = ({ trip, onPress, onSharePress, wrapperStyle }) => {
  let profileImage = null;
  if (trip.User.avatar) {
    profileImage = (<Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  let tripColor = null;
  if (trip.type === FEED_TYPE_OFFER) { tripColor = 'pink'; }
  if (trip.type === FEED_TYPE_WANTED) { tripColor = 'blue'; }

  let tripLabel = null;
  if (trip.type === FEED_TYPE_OFFER) { tripLabel = trans('feed.offering_a_ride'); }
  if (trip.type === FEED_TYPE_WANTED) { tripLabel = trans('feed.asking_for_ride'); }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableHighlight
        onPress={() => onPress(FEEDABLE_TRIP, trip)}
      >
        <View>
          <TripImage
            imageURI={trip.photo ? trip.photo : trip.mapPhoto}
            height={cardHeight * 0.48}
          />
          <TripTypePill color={tripColor} label={tripLabel} />
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username}>{trip.User.firstName}</Text>
                {
                  trip.type === FEED_TYPE_OFFER &&
                  <Text> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
                }
                {trip.type === FEED_TYPE_WANTED && (<Text> {trans('feed.asks_for_a_ride')}</Text>)}
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                {trip.TripStart.name} - {trip.TripEnd.name}
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                <Date format="MMM DD, YYYY HH:mm">{trip.date}</Date>
                {
                  trip.flexibilityInfo && trip.flexibilityInfo.duration !== 0 &&
                  <Text style={{ fontSize: 13, color: Colors.text.gray }}>
                    {trip.flexibilityInfo.type === FLEXIBILITY_EARLIER_TYPE ? ' -' : ' +'}
                    {trip.flexibilityInfo.duration}
                    {trip.flexibilityInfo.unit}
                  </Text>
                }
              </Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={[styles.text, styles.commentText]}>{trip.description}</Text>
            <LinearGradient
              colors={Gradients.transparentWhite}
              style={styles.commentGradientOverlay}
            />
          </View>
          <View style={styles.profilePicWrapper}>
            {profileImage}
          </View>
        </View>
      </TouchableHighlight>
      {
        typeof onSharePress === 'function' &&
        <Footer
          onSharePress={() => onSharePress(FEEDABLE_TRIP, trip)}
          onCommentPress={() => onPress(FEEDABLE_TRIP, trip)}
          totalComments={trip.totalComments}
        />
      }
    </View>
  );
};

Trip.propTypes = {
  trip: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func,
  wrapperStyle: ViewPropTypes.style,
};

Trip.defaultProps = {
  wrapperStyle: {},
  onSharePress: null,
};

export default Trip;
