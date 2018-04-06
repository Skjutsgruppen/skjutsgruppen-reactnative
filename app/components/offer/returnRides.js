import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';
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
});

const ReturnRides = ({ avatar, trips, type, onPress }) => (
  <View style={styles.returnRidesWrapper}>
    <AppText fontVariation="bold" color={Colors.text.blue} style={{ marginBottom: 16 }}>Return rides:</AppText>
    {
      trips.map(trip => (
        <View key={trip.id} style={styles.card}>
          <View style={styles.profilePicWrapper}>
            <Image source={{ uri: avatar }} style={styles.profilePic} />
            <View
              style={[
                styles.indicator,
                (type === FEED_FILTER_WANTED) ? styles.blueBg : styles.pinkBg,
              ]}
            />
          </View>
          <TouchableOpacity style={styles.content} onPress={() => onPress(trip.id)}>
            <AppText>{trip.TripStart.name} - {trip.TripEnd.name}</AppText>
            <Date format="YYYY-MM-DD HH:mm">{trip.date}</Date>
          </TouchableOpacity>
        </View>
      ))
    }
  </View>
);

ReturnRides.propTypes = {
  avatar: PropTypes.string,
  trips: PropTypes.arrayOf(PropTypes.shape({
    TripStart: PropTypes.shape,
    date: PropTypes.string,
  })).isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ReturnRides.defaultProps = {
  avatar: '',
};

export default ReturnRides;
