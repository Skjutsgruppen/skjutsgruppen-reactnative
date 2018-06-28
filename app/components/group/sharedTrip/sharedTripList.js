import React from 'react';
import { StyleSheet, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import ListItem from '@components/profile/listItem';
import { getDate } from '@config';
import { Colors } from '@theme';
import { FEED_TYPE_OFFER } from '@config/constant';
import { AppText } from '@components/utils/texts';

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
            onPress={() => navigation.navigate('TripDetail', { id: item.id })}
            onExperiencePress={() => { }}
            showIndicator
            indicatorColor={item.type === FEED_TYPE_OFFER ?
              Colors.background.pink : Colors.background.blue}
            seats={item.seats}
          />)
      }
      keyExtractor={(item, index) => index}
      renderSectionHeader={
        ({ section }) => <AppText style={styles.sectionHeader}>{section.title}</AppText>
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
        name: PropTypes.string,
      }),
      TripEnd: PropTypes.shape({
        name: PropTypes.string,
      }),
      direction: PropTypes.string,
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      seats: PropTypes.number,
    }).isRequired,
  ).isRequired,
};

SharedTripList.defaultProps = {
  groupTrips: {
    TripStart: {
      name: '',
    },
    TripEnd: {
      name: '',
    },
    direction: null,
  },
};

export default SharedTripList;
