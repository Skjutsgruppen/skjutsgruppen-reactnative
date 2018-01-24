import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Date from '@components/date';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 4,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const ActiveRideItem = ({ trip, navigation }) => {
  let tripName = `${trip.TripStart.name} - ${trip.TripEnd.name}`;

  if (tripName.length > 25) {
    tripName = `${tripName.slice(0, 25)} ...`;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('TripDetail', { trip })}
      key={trip.id}
    >
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {trip.photo ? renderPic(trip.photo) : renderPic(trip.mapPhoto)}
          </View>
          <View>
            <Text>{tripName}</Text>
            <Text style={styles.lightText}><Date format="MMM DD, YYYY HH:mm">{trip.date}</Date></Text>
          </View>
        </View>
        <View>
          <Image
            source={require('@assets/icons/icon_chevron_right.png')}
            style={styles.chevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

ActiveRideItem.propTypes = {
  trip: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

ActiveRideItem.defaultProps = {
  trip: {},
};

export default withNavigation(ActiveRideItem);
