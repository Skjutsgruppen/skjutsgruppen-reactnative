import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import { withTrips } from '@services/apollo/auth';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  lightText: {
    color: Colors.text.gray,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
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

const item = (trip, navigation) => (
  <TouchableOpacity
    onPress={() => {
      let nav = 'AskDetail';
      let params = { ask: trip };
      if (trip.type === 'offered') {
        nav = 'OfferDetail';
        params = { offer: trip };
      }

      navigation.navigate(nav, params);
    }}
    key={trip.id}
  >
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {renderPic(trip.photo)}
        </View>
        <View>
          <Text>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
          <Text style={styles.lightText}>{trip.date}</Text>
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

const Ride = ({ trips, navigation }) => {
  let render = (<Text>No Ride.</Text>);

  if (trips.count > 0) {
    render = trips.rows.map(trip => item(trip, navigation));
  }

  if (trips.loading) {
    render = (<Loading />);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {('Your active rides'.toUpperCase())}
      </Text>
      {render}
    </View>
  );
};

Ride.propTypes = {
  trips: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};


export default withTrips(Ride);
