import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';
import { FEED_TYPE_WANTED } from '@config/constant';
import Colors from '@theme/colors';
import { getDate } from '@config';
import Moment from 'moment';

const GroupCalendar = ({ groupTrips, handleDayPress, loading }) => {
  const checkAndRedirect = (date) => {
    groupTrips.forEach((trip) => {
      if (getDate(trip.date).format('YYYY-MM-DD') === date) {
        handleDayPress(date);
      }
    });
  };

  const dates = groupTrips.map((trip) => {
    const tt = `${getDate(trip.date).format('YYYY-MM-DD')}${trip.type.charAt(0)}`;

    return tt;
  });

  const uniqueDates = new Set(dates);

  console.log(groupTrips, uniqueDates);

  const markedDates = {};
  let tripDate = Moment().format('YYYY-MM-DD');
  let selectedDate = '';
  let tripColor = '';
  let currentDateAdded = false;

  groupTrips.forEach((trip) => {
    selectedDate = getDate(trip.date);

    if (selectedDate.isAfter() && !currentDateAdded) {
      currentDateAdded = true;
      tripDate = selectedDate.format('YYYY-MM-DD');
    }

    tripColor = (trip.type === FEED_TYPE_WANTED) ? Colors.background.blue : Colors.background.pink;
    markedDates[selectedDate.format('YYYY-MM-DD')] = { startingDay: true, textColor: 'white', color: selectedDate.isBefore() ? Colors.background.gray : tripColor, endingDay: true };
  });


  return (
    <View>
      <Calendar
        firstDay={1}
        displayLoadingIndicator={loading}
        markingType={'period'}
        current={tripDate}
        markedDates={Object.keys(markedDates).length > 0 ? markedDates : null}
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
