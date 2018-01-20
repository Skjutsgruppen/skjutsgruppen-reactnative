import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import ShareIcon from '@assets/icons/ic_share.png';
import CommentIcon from '@assets/icons/ic_comment.png';
import Date from '@components/date';
import { trans } from '@lang/i18n';
import { FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';

const cardHeight = 484;
const profilePicSize = 60;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  wrapper: {
    height: cardHeight,
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
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.gray,
  },
  img: {
    width: '100%',
    height: cardHeight / 2,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    top: (cardHeight / 2) - (profilePicSize / 2),
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
  tripType: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  typeText: {
    color: Colors.text.white,
    fontSize: 10,
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  comment: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentGradientOverlay: {
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.85)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 24,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCout: {
    color: '#888',
    marginRight: 10,
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
  shareIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

const Trip = ({ trip, onPress, onSharePress, wrapperStyle }) => {
  let image = null;
  if (trip.mapPhoto) {
    image = (<Image source={{ uri: trip.mapPhoto }} style={styles.img} />);
  }

  if (trip.photo) {
    image = (<Image source={{ uri: trip.photo }} style={styles.img} />);
  }

  let profileImage = null;
  if (trip.User.avatar) {
    profileImage = (<Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableWithoutFeedback
        onPress={() => onPress(FEEDABLE_TRIP, trip)}
        style={styles.flex1}
      >
        <View style={styles.flex1}>
          <View style={styles.imgWrapper}>
            {image}
          </View>
          <View style={[
            styles.tripType,
            trip.type === FEED_TYPE_OFFER && styles.pinkBg,
            trip.type === FEED_TYPE_WANTED && styles.blueBg,
          ]}
          >
            <Text style={styles.typeText}>
              {trip.type === FEED_TYPE_OFFER && trans('feed.offering_a_ride')}
              {trip.type === FEED_TYPE_WANTED && trans('feed.asking_for_ride')}
            </Text>
          </View>
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username}>{trip.User.firstName || trip.User.email} </Text>
                {
                  trip.type === FEED_TYPE_OFFER &&
                  <Text> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
                }
                {trip.type === FEED_TYPE_WANTED && trans('feed.asks_for_a_ride')}
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                {trip.TripStart.name} - {trip.TripEnd.name}
              </Text>
              <Text style={[styles.text, styles.lightText]}><Date format="MMM DD, YYYY HH:mm">{trip.date}</Date></Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>{trip.description}</Text>
            <View style={styles.commentGradientOverlay} />
          </View>
          <View style={styles.profilePicWrapper}>
            {profileImage}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => onSharePress(FEEDABLE_TRIP, trip)}>
          <Image source={ShareIcon} style={styles.shareIcon} />
        </TouchableOpacity>
        <View style={styles.commentIcon}>
          <Text style={styles.commentCout}>{trip.totalComments}</Text>
          <TouchableOpacity onPress={() => onPress(FEEDABLE_TRIP, trip)}>
            <Image source={CommentIcon} style={styles.commentIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>);
};

Trip.propTypes = {
  trip: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  wrapperStyle: View.propTypes.style,
};

Trip.defaultProps = {
  wrapperStyle: {},
};

export default Trip;
