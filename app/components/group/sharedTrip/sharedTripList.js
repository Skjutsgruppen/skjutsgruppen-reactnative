import React, { Component } from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import PropTypes from 'prop-types';
import ListItem from '@components/profile/listItem';
import { getDate } from '@config';
import { Colors } from '@theme';
import { FEED_TYPE_OFFER } from '@config/constant';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  sectionHeader: {
    height: 66,
    color: Colors.text.blue,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGray,
  },
});


class SharedTripList extends Component {
  state = {
    tripDates: [],
    tripsByDate: [],
  }

  componentWillMount() {
    const { groupTripCalendar } = this.props;
    const tripsByDate = [];
    let date = '';
    const tripDates = [];
    groupTripCalendar.forEach((trip) => {
      date = getDate(trip.date).format('YYYY-MM-DD');

      if (!tripDates.includes(date)) {
        tripDates.push(date);
        tripsByDate.push({ title: date, data: [trip] });
      } else {
        tripsByDate[tripDates.indexOf(date)].data.push(trip);
      }
    });
    this.setState({
      tripDates,
      tripsByDate,
    });
  }

  componentDidUpdate() {
    const { tripsByDate } = this.state;
    const { currentDate } = this.props;
    let currentDateIndex = 0;

    tripsByDate.reduce((acc, trip, index) => {
      if (trip.title === currentDate) currentDateIndex = index;
      return null;
    });

    if (this.sectionListRef) {
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: currentDateIndex,
        itemIndex: -1,
      });
    }
  }

  getCurrentDateIndex = () => {
    const { tripDates } = this.state;
    const { currentDate } = this.props;
    return tripDates.indexOf(currentDate);
  }

  calculateOffset = (data, index) => {
    let position = 0;
    let sectionIndex = 0;
    let offset = 0;
    while (position < index) {
      position += 1; // for header
      offset += 66; // for header
      position += data[sectionIndex].data.length; // for items
      offset += data[sectionIndex].data.length * 80; // for items
      position += 1; // for footer. to stop loop
      sectionIndex += 1;
    }
    return (
      { length: 66, offset, index }
    );
  }

  render() {
    const { navigation, groupTripCalendar } = this.props;
    const { tripsByDate } = this.state;
    return (
      <SectionList
        initialNumToRender={groupTripCalendar.length + (tripsByDate.length * 2)}
        sections={tripsByDate}
        renderItem={
          ({ item }) => {
            const date = getDate(item.date).format('YYYY-MM-DD');
            return (
              <View style={{ backgroundColor: this.props.currentDate === date ? '#e8f3fd' : Colors.background.mutedBlue }}>
                <ListItem
                  trip={item}
                  onPress={() => navigation.navigate('TripDetail', { id: item.id })}
                  onExperiencePress={() => { }}
                  showIndicator
                  indicatorColor={item.type === FEED_TYPE_OFFER ?
                    Colors.background.pink : Colors.background.blue}
                  seats={item.seats}
                />
              </View>
            );
          }
        }
        keyExtractor={(item, index) => index}
        renderSectionHeader={
          ({ section }) => (
            <View style={{ backgroundColor: this.props.currentDate === section.title ? '#e8f3fd' : Colors.background.mutedBlue }}>
              <AppText style={styles.sectionHeader}>{section.title}</AppText>
            </View>
          )
        }
        renderSectionFooter={null}
        ref={(section) => { this.sectionListRef = section; }}
        getItemLayout={this.calculateOffset}
      />
    );
  }
}

SharedTripList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  groupTripCalendar: PropTypes.arrayOf(
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
  currentDate: PropTypes.string.isRequired,
};

SharedTripList.defaultProps = {
  groupTripCalendar: {
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
