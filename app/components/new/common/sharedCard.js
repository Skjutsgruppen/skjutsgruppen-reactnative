import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import Date from '@components/date';

const styles = StyleSheet.create({
  wrapper: {
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
  if (trip.photo) {
    image = (<Image source={{ uri: trip.photo }} style={styles.img} />);
  } else {
    image = (<Image source={require('@assets/feed-img.jpg')} style={styles.img} />);
  }

  let title = null;
  if (trip.type === 'offered') {
    title = (
      <Text style={styles.text}>
        {trip.User.firstName || trip.User.email}
        <Text> offers {trip.seats} {trip.seats > 1 ? 'seats' : 'seat'} </Text>
      </Text>
    );
  } else if (trip.type === 'wanted') {
    title = (
      <Text style={styles.text}>
        {trip.User.firstName || trip.User.email}
        <Text> asks for a ride</Text>
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => onPress(trip.type, trip)}
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

export default SharedCard;
