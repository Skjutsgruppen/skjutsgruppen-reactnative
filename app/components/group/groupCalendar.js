import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';

import { FEED_TYPE_WANTED } from '@config/constant';
import Colors from '@theme/colors';
import { getDate } from '@config';

const GroupCalendar = ({ groupTrips, handleDayPress, loading }) => {
  const checkAndRedirect = (date) => {
    groupTrips.forEach((trip) => {
      if (getDate(trip.date).format('YYYY-MM-DD') === date) {
        handleDayPress(date);
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
    tripColor = (trip.type === FEED_TYPE_WANTED) ? Colors.background.blue : Colors.background.pink;
    markedDates[selectedDate.format('YYYY-MM-DD')] = { startingDay: true, textColor: 'white', color: selectedDate.isBefore() ? Colors.background.gray : tripColor, endingDay: true };
  });

  return (
    <View>
      <Calendar
        displayLoadingIndicator={loading}
        markingType={'period'}
        current={tripDate}
        markedDates={markedDates}
        onDayPress={day => checkAndRedirect(day.dateString)}
        theme={{
          'stylesheet.day.period': {
            base: {
              width: 34,
              height: 34,
              alignItems: 'center',
            },
            todayText: {
              fontWeight: '500',
              color: Colors.text.blue,
            },
          },
        }}
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
