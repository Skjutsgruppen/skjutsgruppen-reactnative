import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import PlaceInput from '@components/search/place/placeInput';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { AppText, Heading } from '@components/utils/texts';
import { Circle, RoundedButton } from '@components/common';
import { Colors, Gradients } from '@theme';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEED_TYPE_PUBLIC_TRANSPORT, FEED_TYPE_GROUP } from '@config/constant';
import CalendarModal from '@components/common/calendarModal';
import SearchIcon from '@assets/icons/ic_search.png';
import SearchIconActive from '@assets/icons/ic_search_active.png';
import { trans } from '@lang/i18n';
import DiscoverGroupCard from '@components/group/discoverGroupCard';
import { withExploreGroup } from '@services/apollo/group';
import { getDate } from '@config';
import TouchableHighlight from '@components/touchableHighlight';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CrossIcon from '@assets/icons/ic_cross_pink.png';

const DiscoverGroup = withExploreGroup(DiscoverGroupCard);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightBlueWhite,
  },
  title: {
    paddingHorizontal: 20,
    marginTop: '10%',
    marginBottom: '5%',
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
    textAlign: 'center',
    marginTop: 20,
  },
  switchSpacer: {
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
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 4,
    marginBottom: 12,
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingLeft: 24,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  changeBtnWrapper: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  changeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtnWrapper: {
    height: 24,
    width: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 6,
  },
  clearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  clearIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  resultsFrom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  divider: {
    marginBottom: 40,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
  },
});

class Search extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused }) => <Image source={focused ? SearchIconActive : SearchIcon} />,
    tabBarOnPress: ({ scene, jumpToIndex }) => {
      if (scene.focused) {
        const navigationInRoute = scene.route;
        if (!!navigationInRoute
          && !!navigationInRoute.params
          && !!navigationInRoute.params.scrollToTop) {
          navigationInRoute.params.scrollToTop();
        }
      }
      jumpToIndex(2);
    },
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
      directionFrom: null,
      directionTo: null,
      filters: [FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEED_TYPE_PUBLIC_TRANSPORT, FEED_TYPE_GROUP],
      markedDates: {},
      dates: [],
      modalVisible: false,
    };
    this.scrollView = null;
  }

  componentWillMount() {
    const { navigation } = this.props;

    if (navigation.state.params) {
      const {
        fromObj,
        toObj,
        filters,
        direction,
        dates,
      } = navigation.state.params;

      this.setState({
        from: fromObj,
        to: toObj,
        directionFrom: !fromObj.name ? direction : null,
        directionTo: !toObj.name ? direction : null,
        filters,
        direction,
        dates: dates.map(date => new Date(date)),
      });
    }

    navigation.setParams({ scrollToTop: this.scrollToTop });
    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));
  }

  onFilterSelect = (param) => {
    const { filters } = this.state;

    if (this.state.filters.indexOf(param) > -1) {
      filters.splice(this.state.filters.indexOf(param), 1);
    } else {
      filters.push(param);
    }

    if (filters.length > 0) {
      this.setState({ filters });
    }
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
    this.setModalVisible(false);
    this.setState({ dates: [date] });
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setStartPlace = ({ place, direction }) => {
    this.setState({ from: place, directionFrom: direction });
  }

  setEndPlace = ({ place, direction }) => {
    this.setState({ to: place, directionTo: direction });
  }

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  tabEvent = (e, type) => {
    if (this.scrollView && type === 'didBlur') {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  switchLocation = () => {
    const { from, to, directionFrom, directionTo } = this.state;

    if (directionFrom || directionTo) {
      this.setState({ directionFrom: directionTo, directionTo: directionFrom });
    }

    this.setState({ from: to, to: from });
  };

  renderSearch = () => {
    let error = 0;

    const { navigation } = this.props;
    const { from, to, direction, directionFrom, directionTo, filters, dates } = this.state;

    if (from.coordinates.length === 0 && to.coordinates.length === 0) {
      Alert.alert('Error!!', trans('search.either_from_of_to_is_required'));
      error += 1;
    }

    if (error === 0) {
      navigation.navigate('SearchResult', {
        from,
        to,
        direction: directionFrom || directionTo || direction,
        directionFrom,
        directionTo,
        filters,
        dates,
      });
    }
  }

  render() {
    const { filters, dates, directionFrom, directionTo } = this.state;
    const selectedDate = dates && dates.length > 0 ? Moment(dates[0].getTime()).format('YYYY-MM-DD HH:mm') : null;

    return (
      <View style={styles.wrapper}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          ref={(ref) => { this.scrollView = ref; }}
          showsVerticalScrollIndicator={false}
        >
          <Circle />
          <Heading
            size={24}
            color={Colors.text.white}
            fontVariation="bold"
            style={styles.title}
          >
            {trans('search.search')}
          </Heading>
          <LinearGradient colors={Gradients.white} style={styles.content}>
            <View style={styles.locationWrapper}>
              <View style={styles.inputWrapper}>
                <PlaceInput
                  defaultValue={this.state.from}
                  defaultDirection={directionFrom}
                  currentLocation
                  placeholder={trans('search.from_where_i_am_now')}
                  onChangeText={this.setStartPlace}
                  style={styles.input}
                  wrapperStyle={{ flex: 1 }}
                  direction={!directionTo}
                />
                <AppText
                  size={12}
                  color={Colors.text.gray}
                  fontVariation="bold"
                  style={styles.inputLabel}
                >
                  {trans('global.from')}
                </AppText>
              </View>
              <View style={styles.inputWrapper}>
                <View style={styles.switchSpacer} />
                <TouchableOpacity onPress={this.switchLocation} style={styles.locationSwitcher}>
                  <Image source={require('@assets/icons/icon_switcher.png')} style={styles.switcherIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <PlaceInput
                  placeholder={trans('global.destination')}
                  defaultDirection={directionTo}
                  defaultValue={this.state.to}
                  onChangeText={this.setEndPlace}
                  style={styles.input}
                  wrapperStyle={{ flex: 1 }}
                  direction={!directionFrom}
                />
                <AppText
                  size={12}
                  color={Colors.text.gray}
                  fontVariation="bold"
                  style={styles.inputLabel}
                >
                  {trans('global.to')}
                </AppText>
              </View>
            </View>
            <View style={styles.dateRow}>
              <AppText size={14} color={Colors.text.gray} style={{ flex: 1 }}>
                {
                  selectedDate ||
                  trans('search.all_dates_and_times')
                }
              </AppText>
              {
                dates.length > 0 &&
                <View style={styles.clearBtnWrapper}>
                  <TouchableHighlight
                    onPress={() => this.setState({ dates: [] })}
                    style={styles.clearBtn}
                  >
                    <Image source={CrossIcon} style={styles.clearIcon} />
                  </TouchableHighlight>
                </View>
              }
              <View style={styles.changeBtnWrapper}>
                <TouchableHighlight
                  onPress={() => this.setModalVisible(true)}
                  style={styles.changeBtn}
                >
                  <AppText size={14} color={Colors.text.blue} fontVariation="semibold">
                    {trans('search.change')}
                  </AppText>
                </TouchableHighlight>
              </View>
            </View>
            <DateTimePicker
              mode="datetime"
              is24Hour
              isVisible={this.state.modalVisible}
              onConfirm={pickedDate => this.onSelectDay(pickedDate)}
              onCancel={() => this.setModalVisible(!this.state.modalVisible)}
              date={dates[0] || new Date()}
            />
            <AppText size={14} color={Colors.text.gray} style={{ margin: 20 }}>{trans('search.show_results_from')}</AppText>
            <View style={styles.resultsFrom}>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_OFFER)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_OFFER) > -1 && styles.selected,
                ]}
              >
                <AppText
                  size={12}
                  color={Colors.text.white}
                  fontVariation="semibold"
                >
                  {trans('search.offered')}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_WANTED)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_WANTED) > -1 && styles.selected,
                ]}
              >
                <AppText
                  size={12}
                  color={Colors.text.white}
                  fontVariation="semibold"
                >
                  {trans('search.asked_for')}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_PUBLIC_TRANSPORT)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_PUBLIC_TRANSPORT) > -1 && styles.selected,
                ]}
              >
                <AppText
                  size={12}
                  color={Colors.text.white}
                  fontVariation="semibold"
                >
                  {trans('search.public_transport')}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_GROUP)}
                style={[
                  styles.suggestion,
                  filters.indexOf(FEED_TYPE_GROUP) > -1 && styles.selected,
                ]}
              >
                <AppText
                  size={12}
                  color={Colors.text.white}
                  fontVariation="semibold"
                >
                  {trans('search.groups')}
                </AppText>
              </TouchableOpacity>
            </View>
            <RoundedButton
              bgColor={Colors.background.pink}
              style={styles.searchBtn}
              onPress={this.renderSearch}
            >
              {trans('search.search')}
            </RoundedButton>
            <View style={styles.divider} />
            <DiscoverGroup limit={1} from={null} filter="recent" />
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
