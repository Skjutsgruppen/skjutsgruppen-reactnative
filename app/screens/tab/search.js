import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import PlaceInput from '@components/search/place/placeInput';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Circle, RoundedButton } from '@components/common';
import { Colors, Gradients } from '@theme';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEED_TYPE_PUBLIC_TRANSPORT, FEED_TYPE_GROUP } from '@config/constant';
import SearchIcon from '@assets/icons/ic_search.png';
import SearchIconActive from '@assets/icons/ic_search_active.png';
import { trans } from '@lang/i18n';
import ExploreRecentGroup from '@components/group/exploreRecentCard';
import { withExploreGroup } from '@services/apollo/group';

const ExploreGroupsRecentDetail = withExploreGroup(ExploreRecentGroup);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightBlueWhite,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: '10%',
    marginBottom: '5%',
  },
  scrollArea: {
    flex: 1,
    height: 300,
    backgroundColor: Colors.background.fullWhite,
    marginTop: 24,
  },
  content: {
    backgroundColor: 'red',
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
    width: '50%',
    alignSelf: 'center',
    marginHorizontal: 24,
    marginVertical: 32,
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
      filters: [FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEED_TYPE_PUBLIC_TRANSPORT, FEED_TYPE_GROUP],
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
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Circle />
          <Text style={styles.title}>Search</Text>
          <LinearGradient colors={Gradients.white} style={styles.content}>
            <View style={styles.locationWrapper}>
              <View style={styles.inputWrapper}>
                <PlaceInput
                  defaultValue={this.state.from}
                  currentLocation
                  placeholder={trans('search.from_where_i_am_now')}
                  onChangeText={({ place }) => this.setState({ from: place })}
                  style={styles.input}
                />
                <Text style={styles.inputLabel}>{trans('global.from')}</Text>
              </View>
              <View style={styles.inputWrapper}>
                <View style={styles.divider} />
                <TouchableOpacity onPress={this.switchLocation} style={styles.locationSwitcher}>
                  <Image source={require('@assets/icons/icon_switcher.png')} style={styles.switcherIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <PlaceInput
                  placeholder={trans('global.destination')}
                  defaultValue={this.state.to}
                  onChangeText={({ place }) => this.setState({ to: place })}
                  style={styles.input}
                />
                <Text style={styles.inputLabel}>{trans('global.to')}</Text>
              </View>
            </View>
            {false &&
              <View style={styles.locationSuggestions}>
                <Text style={styles.label}>{trans('search.or_choose')}:</Text>
                <TouchableOpacity onPress={() => this.onDirectionSelect('anywhere')} style={[styles.suggestion, direction === 'anywhere' ? styles.selected : {}]}>
                  <Text style={styles.suggestionText}>{trans('global.anywhere')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onDirectionSelect('north')} style={[styles.suggestion, direction === 'north' ? styles.selected : {}]}>
                  <Text style={styles.suggestionText}>{trans('global.north')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onDirectionSelect('south')} style={[styles.suggestion, direction === 'south' ? styles.selected : {}]}>
                  <Text style={styles.suggestionText}>{trans('global.south')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onDirectionSelect('east')} style={[styles.suggestion, direction === 'east' ? styles.selected : {}]}>
                  <Text style={styles.suggestionText}>{trans('global.east')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onDirectionSelect('west')} style={[styles.suggestion, direction === 'west' ? styles.selected : {}]}>
                  <Text style={styles.suggestionText}>{trans('global.west')}</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>{dates.length === 0 ? trans('search.all_dates_and_times') : (prettyDate).join(', ')}</Text>
              <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                <Text style={styles.changeButton}>{trans('search.change')}</Text>
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
            <Text style={styles.label}>{trans('search.show_results_from')}</Text>
            <View style={styles.resultsFrom}>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_OFFER)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_OFFER) > -1 && styles.selected,
                ]}
              >
                <Text style={styles.suggestionText}>{trans('search.offered')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_WANTED)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_WANTED) > -1 && styles.selected,
                ]}
              >
                <Text style={styles.suggestionText}>{trans('search.asked_for')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_PUBLIC_TRANSPORT)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_PUBLIC_TRANSPORT) > -1 && styles.selected,
                ]}
              >
                <Text style={styles.suggestionText}>{trans('search.public_transport')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_GROUP)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_GROUP) > -1 && styles.selected,
                ]}
              >
                <Text style={styles.suggestionText}>{trans('search.groups')}</Text>
              </TouchableOpacity>
            </View>
            <RoundedButton
              bgColor={Colors.background.pink}
              style={styles.searchBtn}
              onPress={this.renderSearch}
            >
              {trans('search.search')}
            </RoundedButton>
            <ExploreGroupsRecentDetail limit={1} from={null} filter="recent" />
          </LinearGradient>
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
