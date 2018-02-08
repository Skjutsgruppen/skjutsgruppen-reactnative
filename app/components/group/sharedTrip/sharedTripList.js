import React from 'react';
import { StyleSheet, SectionList, Text } from 'react-native';
import PropTypes from 'prop-types';
import ListItem from '@components/profile/listItem';
import { getDate } from '@config';
import { Colors } from '@theme';
import { FEED_TYPE_OFFER } from '@config/constant';

const styles = StyleSheet.create({
  sectionHeader: {
    color: Colors.text.blue,
    paddingHorizontal: 20,
    paddingTop: 30,
    marginTop: 30,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGray,
  },
});

const SharedTripList = ({ groupTrips, navigation }) => {
  const trips = [];
  let date = '';
  const tripDates = [];

  groupTrips.forEach((trip) => {
    date = getDate(trip.date).format('YYYY-MM-DD');

    if (!tripDates.includes(date)) {
      tripDates.push(date);
      trips.push({ title: date, data: [trip] });
    } else {
      trips[tripDates.indexOf(date)].data.push(trip);
    }
  });

  return (
    <SectionList
      sections={trips}
      renderItem={
        ({ item }) => (
          <ListItem
            trip={item}
            onPress={() => navigation.navigate('TripDetail', { trip: item })}
            onExperiencePress={() => { }}
            showIndicator
            indicatorColor={item.type === FEED_TYPE_OFFER ?
              Colors.background.pink : Colors.background.blue}
            seats={item.seats}
          />)
      }
      keyExtractor={(item, index) => index}
      renderSectionHeader={
        ({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>
      }
      ref={(section) => { this.sectionListRef = section; }}
    />
  );
};

SharedTripList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  groupTrips: PropTypes.arrayOf(
    PropTypes.shape({
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
  ).isRequired,
};

export default SharedTripList;
