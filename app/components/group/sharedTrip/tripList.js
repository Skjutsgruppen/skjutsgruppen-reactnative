import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { FEED_FILTER_WANTED } from '@config/constant';
import Date from '@components/date';

const styles = StyleSheet.create({
  returnRidesWrapper: {
    backgroundColor: Colors.background.lightBlueWhite,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    color: Colors.text.blue,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  profilePicWrapper: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  seatIndicator: {
    height: 20,
    width: 20,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.background.pink,
  },
});

const TripList = ({ trip }) => (
  <View style={styles.returnRidesWrapper}>
    <View key={trip.id} style={styles.card}>
      <View style={styles.profilePicWrapper}>
        <Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />
        <View
          style={[
            styles.indicator,
            (trip.type === FEED_FILTER_WANTED) ? styles.blueBg : styles.pinkBg,
          ]}
        />
      </View>
      <TouchableOpacity style={styles.content}>
        <Text>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
        {(trip.seats !== 0 && trip.seats !== '') &&
          <View style={styles.seatIndicator}>
            {trip.seats !== 0 && <Text style={{ color: Colors.text.white, textAlign: 'center' }}>{trip.seats}</Text>}
          </View>
        }
        <Date format="MMM DD, YYYY, HH:mm">{trip.date}</Date>
      </TouchableOpacity>
    </View>
  </View >
);

TripList.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    TripStart: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    TripEnd: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    seats: PropTypes.number.isRequired,
  }).isRequired,
};


export default TripList;
