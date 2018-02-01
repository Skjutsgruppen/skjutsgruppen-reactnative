import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEEDABLE_TRIP } from '@config/constant';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 84,
    marginRight: 36,
    marginBottom: 8,
    backgroundColor: '#f6f9fc',
    padding: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    borderRadius: 12,
  },
  img: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 8,
  },
  text: {
    lineHeight: 20,
    opacity: 0.75,
  },
});

const SharedCard = ({ trip, onPress }) => {
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
      <Text style={styles.text}>
        {trip.User.firstName}
        <Text> offers {trip.seats} {trip.seats > 1 ? 'seats' : 'seat'} </Text>
      </Text>
    );
  }

  if (trip.type === FEED_TYPE_WANTED) {
    title = (
      <Text style={styles.text}>
        {trip.User.firstName}
        <Text> asks for a ride</Text>
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => onPress(FEEDABLE_TRIP, trip)}
      >
        <View>
          {image}
          {title}
          <Text style={styles.text}>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
          <Date format="MMM DD HH:mm" style={styles.text}>{trip.date}</Date>
        </View>
      </TouchableOpacity>
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
});

export default SharedCard;
