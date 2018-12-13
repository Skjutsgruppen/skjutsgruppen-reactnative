import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { getDate } from '@config';
import CalendarSplit from '@assets/icons/calender_split_bg.png';
import Moment from 'moment';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  dayWrapper: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.text.white,
  },
  imageWrapper: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

const GroupCalendar = ({ groupTripCalendar, handleDayPress, loading }) => {
  const checkAndRedirect = (date) => {
    // groupTripCalendar.forEach((trip) => {
    if (getDate(date).format('YYYY-MM-DD') === date) {
      handleDayPress(date);
    }
    // });
  };

  let tripDate = Moment().format('YYYY-MM-DD');
  let selectedDate = '';
  let currentDateAdded = false;
  const tripDates = groupTripCalendar.map(groupTrip => `${getDate(groupTrip.date).format('YYYY-MM-DD')}${groupTrip.type.charAt(0)}`);
  const uniqueTripDates = new Set(tripDates);
  const offers = [...uniqueTripDates].filter(date => date.charAt(date.length - 1) === 'o').map(offerDate => offerDate.substring(0, offerDate.length - 1));
  const wanted = [...uniqueTripDates].filter(date => date.charAt(date.length - 1) === 'w').map(wantedDate => wantedDate.substring(0, wantedDate.length - 1));
  const withoutTripType = [...uniqueTripDates].map(ttd => ttd.substring(0, ttd.length - 1));
  const uniqueWithoutTripType = new Set(withoutTripType);
  const checkCount = (item) => {
    let count = 0;
    withoutTripType.forEach((tDate) => {
      if (item === tDate) { count++; }
    });
    return count;
  };
  const dateObject = {};
  uniqueWithoutTripType.forEach((ttttd) => {
    dateObject[ttttd] = checkCount(ttttd);
  });

  const markedDates = [...uniqueWithoutTripType];

  groupTripCalendar.forEach((trip) => {
    selectedDate = getDate(trip.date);

    if (selectedDate.isAfter() && !currentDateAdded) {
      currentDateAdded = true;
      tripDate = selectedDate.format('YYYY-MM-DD');
    }
  });


  return (
    <View>
      <Calendar
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: Colors.border.lightGray,
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomWidth: 0,
        }}
        firstDay={1}
        displayLoadingIndicator={loading}
        current={tripDate}
        dayComponent={({ date, state }) => {
          const renderDays = () => {
            if (markedDates.includes(date.dateString)) {
              if (dateObject[date.dateString] > 1) {
                if (dateObject[date.dateString]) {
                  return (
                    getDate(date.dateString).isBefore(getDate().format('YYYY-MM-DD')) ?
                      <View style={[styles.dayWrapper, { borderRadius: 16, backgroundColor: Colors.background.gray }]}>
                        <AppText style={styles.dayText}>
                          {date.day}
                        </AppText>
                      </View> :
                      <View style={[styles.dayWrapper, { borderRadius: 16 }]}>
                        <Image
                          style={styles.imageWrapper}
                          source={CalendarSplit}
                        />
                        <AppText style={styles.dayText}>
                          {date.day}
                        </AppText>
                      </View>
                  );
                }
              }

              if (offers.includes(date.dateString)) {
                return (
                  <View style={[styles.dayWrapper, { borderRadius: 16, backgroundColor: getDate(date.dateString).isBefore(getDate().format('YYYY-MM-DD')) ? Colors.background.gray : Colors.background.pink }]}>
                    <AppText style={styles.dayText}>
                      {date.day}
                    </AppText>
                  </View>);
              }

              if (wanted.includes(date.dateString)) {
                return (
                  <View style={[styles.dayWrapper, { borderRadius: 16, backgroundColor: getDate(date.dateString).isBefore(getDate().format('YYYY-MM-DD')) ? Colors.background.gray : Colors.background.blue }]}>
                    <AppText style={styles.dayText}>
                      {date.day}
                    </AppText>
                  </View>);
              }
            } else {
              return (
                <View style={styles.dayWrapper}>
                  <AppText style={[styles.dayText, { color: state === 'disabled' ? Colors.text.gray : Colors.text.black, opacity: state === 'disabled' ? 0.5 : 1 }]}>{date.day}</AppText>
                </View>
              );
            }
          };
          return (
            <TouchableOpacity onPress={() => checkAndRedirect(date.dateString)} disabled={getDate(date.dateString).isBefore(getDate().format('YYYY-MM-DD'))}>
              {renderDays()}
            </TouchableOpacity>);
        }}
        theme={{
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            },
            dayHeader: {
              color: Colors.text.black,
              marginBottom: 20,
            },
          },
        }}
      />
    </View>
  );
};

GroupCalendar.propTypes = {
  loading: PropTypes.bool,
  groupTripCalendar: PropTypes.arrayOf(
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
