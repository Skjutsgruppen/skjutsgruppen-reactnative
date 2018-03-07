import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import { withResetMute } from '@services/apollo/mute';
import { getDate } from '@config';
import Date from '@components/date';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  lightText: {
    color: Colors.text.gray,
  },
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
    marginRight: 16,
  },
  profilePic: {
    width: 46,
    height: 46,
    resizeMode: 'cover',
    borderRadius: 23,
    marginRight: 4,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  muteWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  muteCountWrapper: {
    height: 32,
    minWidth: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 4,
  },
  whiteText: {
    color: Colors.text.white,
    fontSize: 14,
  },
});

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const ActiveRideItem = ({ trip, resetMute, navigation }) => {
  let tripName = `${trip.TripStart.name} - ${trip.TripEnd.name}`;

  if (tripName.length > 25) {
    tripName = `${tripName.slice(0, 25)} ...`;
  }

  const navigateToTripDetail = () => {
    if (trip.muted) {
      resetMute({ mutable: 'Trip', mutableId: trip.id, from: getDate().format() });
    }
    navigation.navigate('TripDetail', { trip });
  };

  return (
    <TouchableOpacity
      onPress={navigateToTripDetail}
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
          {
            trip.muted &&
            (<View style={styles.muteWrapper}>
              <Image source={require('@assets/icons/ic_mute.png')} />
              {
                trip.unreadNotificationCount > 0 &&
                <View style={styles.muteCountWrapper}>
                  <Text style={styles.whiteText}>{trip.unreadNotificationCount}</Text>
                </View>
              }
            </View>)
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

ActiveRideItem.propTypes = {
  trip: PropTypes.shape(),
  resetMute: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

ActiveRideItem.defaultProps = {
  trip: {},
};

export default compose(withResetMute, withNavigation)(ActiveRideItem);
