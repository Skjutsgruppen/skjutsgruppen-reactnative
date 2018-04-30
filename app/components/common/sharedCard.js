import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEEDABLE_TRIP } from '@config/constant';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  card: {
    maxWidth: 500,
    backgroundColor: '#f6f9fc',
    padding: 10,
    marginTop: 16,
    marginHorizontal: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    borderRadius: 12,
    overflow: 'visible',
  },
  img: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'right',
    width: '100%',
    color: Colors.text.gray,
  },
});

const SharedCard = ({ trip, onPress, date }) => {
  let image = null;

  if (trip.mapPhoto) {
    image = (<Image source={{ uri: trip.mapPhoto }} style={styles.img} />);
  } else if (trip.photo) {
    image = (<Image source={{ uri: trip.photo }} style={styles.img} />);
  } else {
    image = (<Image source={require('@assets/feed-img.jpg')} style={styles.img} />);
  }

  let title = null;
  if (trip.type === FEED_TYPE_OFFER) {
    title = (
      <AppText style={styles.text}>
        {trip.User.firstName}
        <AppText style={styles.text}> offers {trip.seats} {trip.seats > 1 ? 'seats' : 'seat'} </AppText>
      </AppText>
    );
  }

  if (trip.type === FEED_TYPE_WANTED) {
    title = (
      <AppText style={styles.text}>
        {trip.User.firstName}
        <AppText> asks for a ride</AppText>
      </AppText>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => onPress(FEEDABLE_TRIP, trip)}
        style={styles.card}
        activeOpacity={0.8}
      >
        <View>
          {image}
          {title}
          <AppText style={styles.text}>
            {
              trip.TripStart.name ||
              (trip.direction.charAt(0).toUpperCase() + trip.direction.slice(1))
            } - {
              trip.TripEnd.name ||
              (trip.direction.charAt(0).toUpperCase() + trip.direction.slice(1))
            }
          </AppText>
          <AppText style={styles.text}><Date calendarTime>{trip.date}</Date></AppText>
        </View>
      </TouchableOpacity>
      {
        date &&
        <AppText style={styles.date}><Date calendarTime>{date}</Date></AppText>
      }
    </View>
  );
};

SharedCard.propTypes = ({
  trip: PropTypes.shape({
    type: PropTypes.string,
    User: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
    }),
    photo: PropTypes.string,
    seats: PropTypes.number,
    date: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  date: PropTypes.string,
});

SharedCard.defaultProps = {
  date: null,
};

export default SharedCard;
