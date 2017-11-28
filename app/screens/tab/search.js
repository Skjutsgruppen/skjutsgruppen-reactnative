import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import GooglePlace from '@components/googlePlace';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import SearchIcon from '@icons/ic_search.png';
import SearchIconActive from '@icons/ic_search_active.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.blue,
    paddingTop: 24,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  scrollArea: {
    flex: 1,
    height: 300,
    backgroundColor: Colors.background.fullWhite,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 16,
  },
  locationWrapper: {
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    width: 60,
    fontWeight: 'bold',
    color: Colors.text.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.background.lightGray,
  },
  switcherIcon: {
    alignSelf: 'center',
    height: 18,
    width: 18,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  locationSwitcher: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.text.gray,
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  locationSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  suggestion: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 4,
    marginBottom: 12,
    justifyContent: 'center',
  },
  suggestionText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  dateLabel: {
    color: Colors.text.darkGray,
  },
  changeButton: {
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  resultsFrom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  selected: {
    backgroundColor: Colors.background.blue,
  },
  searchBtn: {
    marginHorizontal: 24,
    marginVertical: 32,
  },
  earlierSearchesWrapper: {
    backgroundColor: Colors.background.cream,
    padding: 24,
  },
  earlierSearchtitle: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  earlierSearch: {
    paddingVertical: 12,
  },
  exploreGroupWrapper: {
    backgroundColor: Colors.background.cream,
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  exploreGroup: {
    alignItems: 'center',
  },
  telescope: {
    width: 40,
    height: 40,
  },
  exploreGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.blue,
    marginVertical: 12,
    textAlign: 'center',
  },
  closeModal: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 100,
  },
});

class Search extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused }) => <Image source={focused ? SearchIconActive : SearchIcon} />,
  };

  constructor(props) {
    super(props);
    this.state = {
      from: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      to: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      direction: 'anywhere',
      filters: ['offered', 'wanted', 'public', 'group'],
      markedDates: {},
      dates: [],
      modalVisible: false,
    };
  }

  onFilterSelect = (param) => {
    const { filters } = this.state;

    if (this.state.filters.indexOf(param) > -1) {
      filters.splice(this.state.filters.indexOf(param), 1);
    } else {
      filters.push(param);
    }

    this.setState({ filters });
  }

  onDirectionSelect = (param) => {
    const { direction } = this.state;
    if (direction === param) {
      this.setState({ direction: 'anywhere' });
    } else {
      this.setState({ direction: param });
    }
  }

  onSelectDay = (date) => {
    const { markedDates } = this.state;
    const dates = [];
    const selectedDate = date.dateString;

    const newDates = { ...markedDates };

    if (markedDates[selectedDate]) {
      delete newDates[selectedDate];
      this.setState({ markedDates: newDates });
    } else {
      newDates[selectedDate] = [
        { startingDay: true, color: '#1ca9e5', textColor: '#fff' },
        { endingDay: true, color: '#1ca9e5', textColor: '#fff' },
      ];
      this.setState({ markedDates: newDates });
    }

    Object.keys(newDates).forEach((day) => {
      dates.push(day);
    });

    this.setState({ dates });
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  switchLocation = () => {
    const { from, to } = this.state;
    this.setState({ from: to, to: from });
  };

  formatDates() {
    const { dates } = this.state;
    const newDate = [];

    dates.forEach((date) => {
      newDate.push(Moment(date).format('MMM D'));
    });

    return newDate;
  }

  renderSearch = () => {
    let error = 0;

    const { navigation } = this.props;
    const { from, to, direction, filters, dates } = this.state;

    if (from.coordinates.length === 0) {
      Alert.alert('Error!!', 'From is required.');
      error += 1;
    }

    if (error === 0) {
      navigation.navigate('SearchResult', { from, to, direction, filters, dates });
    }
  }

  render() {
    const prettyDate = this.formatDates();
    const { filters, direction, dates, markedDates } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollArea}>
          <View style={styles.locationWrapper}>
            <View style={styles.inputWrapper}>
              <GooglePlace
                defaultValue={this.state.from}
                currentLocation
                placeholder="From where I am now"
                onChangeText={from => this.setState({ from })}
                style={styles.input}
              />
              <Text style={styles.inputLabel}>From</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.divider} />
              <TouchableOpacity onPress={this.switchLocation} style={styles.locationSwitcher}>
                <Image source={require('@icons/icon_switcher.png')} style={styles.switcherIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <GooglePlace
                placeholder="Destination"
                defaultValue={this.state.to}
                onChangeText={to => this.setState({ to })}
                style={styles.input}
              />
              <Text style={styles.inputLabel}>To</Text>
            </View>
          </View>
          <Text style={styles.label}>Or choose:</Text>
          <View style={styles.locationSuggestions}>
            <TouchableOpacity onPress={() => this.onDirectionSelect('anywhere')} style={[styles.suggestion, direction === 'anywhere' ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>Anywhere</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDirectionSelect('north')} style={[styles.suggestion, direction === 'north' ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>North</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDirectionSelect('south')} style={[styles.suggestion, direction === 'south' ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>South</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDirectionSelect('east')} style={[styles.suggestion, direction === 'east' ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>East</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDirectionSelect('west')} style={[styles.suggestion, direction === 'west' ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>West</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>{dates.length === 0 ? 'All dates and times' : (prettyDate).join(', ')}</Text>
            <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            style={{ backgroundColor: '#f00', padding: 50 }}
            onRequestClose={() => { }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
              style={styles.closeModal}
            >
              <Icon
                name={'ios-close'}
                size={32}
                style={{ color: Colors.text.darkCyan }}
              />
            </TouchableOpacity>
            <Calendar
              firstDay={1}
              onDayPress={this.onSelectDay}
              markedDates={markedDates}
              markingType="interactive"
              minDate={Moment(new Date()).format('YYYY-MM-DD')}
              hideExtraDays
              style={{
                justifyContent: 'center',
              }}
            />
          </Modal>
          <Text style={styles.label}>Show results from</Text>
          <View style={styles.resultsFrom}>
            <TouchableOpacity onPress={() => this.onFilterSelect('offered')} style={[styles.suggestion, filters.indexOf('offered') > -1 ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>Offered</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('wanted')} style={[styles.suggestion, filters.indexOf('wanted') > -1 ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>Asked for</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('public')} style={[styles.suggestion, filters.indexOf('public') > -1 ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>Public transport</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('group')} style={[styles.suggestion, filters.indexOf('group') > -1 ? styles.selected : {}]}>
              <Text style={styles.suggestionText}>Groups</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            bgColor={Colors.background.green}
            style={styles.searchBtn}
            onPress={this.renderSearch}
          >
            Search
          </CustomButton>
          <View style={styles.exploreGroupWrapper}>
            <TouchableOpacity style={styles.exploreGroup}>
              <Image source={require('@icons/icon_telescope.png')} style={styles.telescope} />
              <Text style={styles.exploreGroupTitle}>Explore existing groups</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Search;
