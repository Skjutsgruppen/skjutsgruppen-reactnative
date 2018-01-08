import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import { withTrips } from '@services/apollo/auth';
import PropTypes from 'prop-types';
import Date from '@components/date';
import { FEED_TYPE_OFFER } from '@config/constant';

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
  emptyMessage: {
    opacity: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 14,
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
      if (trip.type === FEED_TYPE_OFFER) {
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
          {trip.photo ? renderPic(trip.photo) : renderPic(trip.mapPhoto)}
        </View>
        <View>
          <Text>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
          <Text style={styles.lightText}><Date format="MMM DD HH:mm">{trip.date}</Date></Text>
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
  let render = (<Text style={styles.emptyMessage}>No Ride</Text>);

  if (trips.count > 0) {
    render = trips.rows.map(trip => item(trip, navigation));
  }

  if (trips.error) {
    render = (
      <View style={{ marginTop: 100 }}>
        <Text>Error: {trips.error.message}</Text>
        <TouchableOpacity onPress={() => trips.refetch()}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (trips.loading) {
    render = (
      <View style={styles.spacedWrapper}>
        <Loading />
      </View>
    );
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
    error: PropTypes.object,
    refetch: PropTypes.func,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};


export default withTrips(Ride);
