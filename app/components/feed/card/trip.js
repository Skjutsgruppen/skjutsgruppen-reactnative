import React from 'react';
import { StyleSheet, View, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { TripTypePill, TripImage, Footer } from '@components/feed/card';
import Date from '@components/date';
import { trans } from '@lang/i18n';
import { FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED, FLEXIBILITY_EARLIER_TYPE } from '@config/constant';
import TouchableHighlight from '@components/touchableHighlight';
import LinearGradient from 'react-native-linear-gradient';
import { AppText } from '@components/utils/texts';

const cardHeight = 484;
const imageHeight = 230;
const profilePicSize = 64;

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 19,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 10,
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
    top: imageHeight - (profilePicSize / 2),
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
    flexBasis: 72,
    maxHeight: 72,
    paddingTop: 2,
    paddingHorizontal: 18,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentGradientOverlay: {
    height: 24,
    position: 'absolute',
    bottom: -3,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  recurringShadow: {
    height: 50,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 24,
    marginTop: -50,
    marginBottom: 50,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 2,
    zIndex: 1,
  },
});

const prettify = str => (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

const Trip = ({ trip, onPress, onSharePress, wrapperStyle, shouldHandleRecurring }) => {
  if (trip.isDeleted) {
    return null;
  }

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
    <View>
      <View style={[styles.wrapper, wrapperStyle]}>
        <TouchableHighlight
          onPress={() => onPress(FEEDABLE_TRIP, trip)}
        >
          <View>
            <TripImage
              imageURI={trip.photo ? trip.photo : trip.mapPhoto}
              height={imageHeight}
            />
            {trip.type && <TripTypePill color={tripColor} label={tripLabel} />}
            <View style={styles.detail}>
              <View>
                <AppText style={{ lineHeight: 24 }}>
                  <AppText fontVariation="semibold" color={trip.User.deleted ? Colors.text.black : Colors.text.blue}>
                    {trip.User.firstName}
                  </AppText>
                  {
                    trip.type === FEED_TYPE_OFFER &&
                    <AppText color={Colors.text.darkGray}> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </AppText>
                  }
                  {trip.type === FEED_TYPE_WANTED && (<AppText color={Colors.text.darkGray}> {trans('feed.asks_for_a_ride')}</AppText>)}
                </AppText>
                <AppText color={Colors.text.darkGray} style={[styles.text, styles.lightText]}>
                  {
                    trip.TripStart.name ||
                      prettify(trip.direction)
                  } - {
                    trip.TripEnd.name ||
                      prettify(trip.direction)
                  }
                </AppText>
                <AppText color={Colors.text.darkGray} style={{ marginTop: 6 }}>
                  <Date format="MMM DD, YYYY HH:mm">{trip.date}</Date>
                  {
                    trip.flexibilityInfo && trip.flexibilityInfo.duration !== 0 &&
                    <AppText
                      size={13}
                      color={Colors.text.darkGray}
                    >
                      {trip.flexibilityInfo.type === FLEXIBILITY_EARLIER_TYPE ? ' -' : ' +'}
                      {trip.flexibilityInfo.duration}
                      {trip.flexibilityInfo.unit}
                    </AppText>
                  }
                </AppText>
              </View>
            </View>
            <View style={styles.comment}>
              <AppText style={{ lineHeight: 24 }}>{trip.description}</AppText>
              <LinearGradient
                locations={[0, 0.3, 0.7, 0.8]}
                colors={[
                  'rgba(255, 255, 255, 0)',
                  'rgba(255, 255, 255, 0.5)',
                  'rgba(255, 255, 255, 0.85)',
                  'rgba(255, 255, 255, 1)',
                ]}
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
            totalFeeds={trip.totalFeeds}
          />
        }
      </View>
      {
        shouldHandleRecurring && trip.recurring && <View style={styles.recurringShadow} />
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
  shouldHandleRecurring: PropTypes.bool,
};

Trip.defaultProps = {
  wrapperStyle: {},
  onSharePress: null,
  shouldHandleRecurring: false,
};

export default Trip;
