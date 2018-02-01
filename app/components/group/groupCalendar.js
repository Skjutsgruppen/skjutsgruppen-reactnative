import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';

import { FEED_TYPE_WANTED } from '@config/constant';
import Colors from '@theme/colors';
import { getDate } from '@config';
import Loading from '@components/common/loading';

const GroupCalendar = ({ groupTrips, handleDayPress, loading }) => {
  const checkAndRedirect = (day) => {
    groupTrips.forEach((trip) => {
      if (getDate(trip.date).format('YYYY-MM-DD') === day.dateString) {
        handleDayPress(trip);
      }
    });
  };

  const markedDates = {};
  let tripDate = '';
  let selectedDate = '';
  let tripColor = '';

  groupTrips.forEach((trip, index) => {
    selectedDate = getDate(trip.date);

    if (index === 0) {
      tripDate = selectedDate.format('YYYY-MM-DD');
    }
    tripColor = (trip.type === FEED_TYPE_WANTED) ?
      Colors.background.blue : Colors.background.pink;

    markedDates[selectedDate.format('YYYY-MM-DD')] = [
      {
        startingDay: true,
        color: selectedDate.isBefore() ? Colors.background.gray : tripColor,
        textColor: '#fff',
      },
      {
        endingDay: true,
        color: selectedDate.isBefore() ? Colors.background.gray : tripColor,
        textColor: '#fff',
      },
    ];
  });

  return (
    <View>
      {loading && <Loading />}
      <Calendar
        markingType="interactive"
        current={tripDate}
        markedDates={markedDates}
        onDayPress={checkAndRedirect}
      />
    </View>
  );
};

GroupCalendar.propTypes = {
  loading: PropTypes.bool,
  groupTrips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleDayPress: PropTypes.func.isRequired,
};

GroupCalendar.defaultProps = {
  loading: false,
};

export default GroupCalendar;
