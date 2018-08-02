import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Image, SectionList, Animated } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import Moment from 'moment';
import { Wrapper, Loading, FloatingBackButton, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import SearchItem from '@components/search/searchItem';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/share';
import { trans } from '@lang/i18n';
import NoResult from '@components/search/noResult';
import {
  FEED_TYPE_OFFER,
  FEED_TYPE_PUBLIC_TRANSPORT,
  FEED_TYPE_GROUP,
  FEED_TYPE_WANTED,
  FEEDABLE_GROUP,
  FEEDABLE_TRIP,
  FEEDABLE_PROFILE,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { getDate } from '@config';
import AppText from '@components/utils/texts/appText';
import LoadMore from '@components/message/loadMore';

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList,
);

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: Colors.background.fullWhite,
    overflow: 'visible',
    elevation: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: Colors.text.gray,
    marginTop: 4,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestion: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 4,
    marginTop: 12,
    justifyContent: 'center',
  },
  arrowContainer: {
    marginTop: 24,
  },
  selected: {
    backgroundColor: Colors.background.blue,
  },
  whiteText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  lightText: {
    color: Colors.text.gray,
    fontSize: 12,
  },
  backRow: {
    paddingBottom: 0,
    paddingTop: 16,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  animatedRow: {
    marginLeft: 58,
    overflow: 'hidden',
    zIndex: 1,
  },
  fromRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  toRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  switchViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },
  viewSwitcher: {
    height: 30,
    width: 100,
    paddingHorizontal: 20,
    backgroundColor: Colors.background.fullWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSwitch: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  listSwitch: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  button: {
    width: '60%',
    paddingHorizontal: 16,
    marginTop: 32,
  },
  sectionHeaderWrapper: {
    backgroundColor: Colors.background.mutedBlue,
  },
  sectionHeader: {
    color: Colors.text.darkGray,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  indicators: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  indicatorWrapper: {
    marginRight: 16,
  },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
  },
  pink: {
    backgroundColor: Colors.background.pink,
  },
  blue: {
    backgroundColor: Colors.background.blue,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginTop: 24,
    marginBottom: 10,
  },
});

class SearchResult extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-search-outline"
        iconFocused="ios-search"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      Shareable: {},
      shareableType: '',
      showShareModal: false,
      resultsStyle: 'card',
      arrowX: 0,
      groups: {},
      trips: [],
      sections: [],
      prevGroups: { rows: [] },
      totalTrips: 0,
      totalGroups: 0,
      filters: [],
      remainingTrips: [],
      displayGroup: false,
      date: null,
      currentFetchDate: null,
      prevTrips: { rows: [] },
      publicTransportEndDate: null,
      publicTransportData: false,
      publicTransportRemoved: false,
    };
  }

  componentWillMount() {
    const { filters } = this.props;
    let { resultsStyle } = this.state;
    const groupFilters = [];

    if (filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)) {
      resultsStyle = 'list';
    }

    this.setState({ filters, resultsStyle, groupFilter: groupFilters });
  }

  async componentWillReceiveProps({ searchAllTrips, searchAllGroups }) {
    const { filters } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    if (filters.length === 1 && filters.includes(FEED_TYPE_GROUP)) {
      this.setState({
        resultsStyle: 'list',
      });
    }

    if (searchAllGroups && !searchAllGroups.loading && searchAllGroups.rows.length > 0) {
      let groupRepeated = false;
      searchAllGroups.rows.forEach((newGroup) => {
        this.state.prevGroups.rows.forEach((prevGroup) => {
          if (prevGroup.id === newGroup.id) {
            groupRepeated = true;
          }
        });
      });

      if (!groupRepeated && filters.includes(FEED_TYPE_GROUP)) {
        this.setState({
          prevGroups: { ...searchAllGroups },
          totalGroups: this.state.totalGroups + searchAllGroups.rows.length,
        });

        const groups = {
          title: 'Group',
          data: searchAllGroups.rows,
        };

        await this.setState({ groups });
      }
    }

    if (searchAllTrips && !searchAllTrips.loading) {
      const filteredTrips = [];
      let publicTransportData = false;
      let tripCount = 0;
      let repeated = false;

      searchAllTrips.rows.forEach((newTrip) => {
        const { __typename } = newTrip;
        this.state.prevTrips.rows.forEach((prevTrip) => {
          if (__typename !== 'PublicTransport' && newTrip.id === prevTrip.id) {
            repeated = true;
          } else if (__typename === 'PublicTransport' && newTrip.date === prevTrip.date) {
            repeated = true;
          }
        });
        if (!repeated) {
          if (__typename === 'PublicTransport' && publicTransportSelected) {
            filteredTrips.push(newTrip);
            publicTransportData = true;
          } else if (__typename !== 'PublicTransport') {
            tripCount += 1;
            filteredTrips.push(newTrip);
          }
        }
      });

      if (repeated && this.state.publicTransportData) {
        publicTransportData = true;
      }

      this.setState(
        {
          totalTrips: this.state.totalTrips + tripCount,
          publicTransportData,
          prevTrips: { ...searchAllTrips },
        },
      );

      let newSections = this.state.sections;
      const lastSection = newSections[newSections.length - 1];
      const remainingTrips = this.state.remainingTrips;
      const tripsObj = [];
      let displayGroup = false;
      let date = this.state.date;
      let title = null;

      if (searchAllTrips.rows.length < 1) this.setState({ displayGroup: true });

      if (filteredTrips.length > 0) {
        filteredTrips.forEach((a) => {
          const titleDate = new Date(a.date);
          title = Moment(titleDate).format('MMM D, YYYY');
          const { __typename } = a;

          if (__typename === 'PublicTransport') {
            this.setState({ publicTransportEndDate: getDate(a.ServiceDays[0].planningPeriodEnd).format('YYYY-MM-DD') });
          }

          if (!date) {
            date = title;
          }

          if (date && date !== title) {
            remainingTrips[title] = remainingTrips[title] || [];
            remainingTrips[title].push(a);
          } else {
            tripsObj[title] = tripsObj[title] || [];
            tripsObj[title].push(a);
          }
        });
      }

      this.setState({ remainingTrips, date });

      if (date !== title && filters.includes(FEED_TYPE_GROUP)) {
        displayGroup = true;
        await this.setState({ displayGroup });
      }

      let trips = [];

      if (Object.keys(tripsObj).length > 0) {
        trips = Object.keys(tripsObj).map(key => ({ title: key, data: tripsObj[key] }));
      }

      if (lastSection && lastSection.title !== 'Group' && trips.length > 0) {
        trips.forEach((trip) => {
          if (trip.title === lastSection.title) {
            newSections[newSections.length - 1].data = newSections[newSections.length - 1]
              .data.concat(trip.data);
          } else {
            newSections = newSections.concat(trip);
          }
        });
      } else {
        newSections = newSections.concat(trips.map(row => row));
      }

      if (displayGroup || this.shouldDisplayGroup()) {
        let groupRepeated = false;
        let groupIndex = null;

        newSections.forEach((section, index) => {
          if (section.title === 'Group') {
            groupIndex = index;
            section.data.forEach((group) => {
              this.state.groups.data.forEach((newGroup) => {
                if (newGroup.id === group.id) {
                  groupRepeated = true;
                }
              });
            });
          }
        });

        if (!groupRepeated && Object.keys(this.state.groups).length > 0) {
          if (groupIndex !== null) {
            newSections[groupIndex].data = newSections[groupIndex]
              .data.concat(this.state.groups.data);
          } else {
            newSections = newSections.concat(this.state.groups);
          }
        }
      }

      let remainingTripsObj = [];

      if (Object.keys(remainingTrips).length > 0 &&
        (Object.keys(this.state.groups).length > 0 || !filters.includes(FEED_TYPE_GROUP))) {
        remainingTripsObj = Object.keys(remainingTrips)
          .map(key => ({ title: key, data: remainingTrips[key] }));
      }

      if (Object.keys(remainingTripsObj).length > 0) {
        const lastIndex = newSections[newSections.length - 1];
        if (lastIndex && lastIndex.title !== 'Group' && Object.keys(remainingTripsObj).length > 0) {
          remainingTripsObj.forEach((trip) => {
            if (trip.title === lastIndex.title) {
              newSections[newSections.length - 1].data = newSections[newSections.length - 1]
                .data.concat(trip.data);
            } else {
              newSections = newSections.concat(trip);
            }
          });
        } else {
          newSections = newSections.concat(remainingTripsObj.map(row => row));
        }
        this.setState({ remainingTrips: [] });
      }


      this.setState({ trips, sections: newSections });
    }
  }

  onPress = (type, { id }) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { id });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { id });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: id });
    }
  };

  onFilterSelect = (param) => {
    const { filters } = this.state;
    const { searchAllGroups, searchAllTrips } = this.props;

    if (!searchAllGroups.loading || !searchAllTrips.loading) {
      if (filters.includes(param)) {
        filters.splice(filters.indexOf(param), 1);
      } else {
        filters.push(param);
      }

      if (filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)) {
        this.setState({ resultsStyle: 'list' });
      } else {
        this.setState({ resultsStyle: 'card' });
      }

      if (filters.length > 0) {
        this.setState({ filters, currentFetchDate: null });

        if (filters.includes(FEED_TYPE_OFFER) ||
          filters.includes(FEED_TYPE_WANTED) ||
          filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)) {
          this.refetchTrips();
        }

        if (filters.includes(FEED_TYPE_GROUP)) {
          this.refetchGroups();
        }
      }
    }
  }

  setArrowOffset = (x, width) => {
    const xOffset = x + 20 + (width / 2);
    this.setState({ arrowX: xOffset });
  }

  getFetchDate = () => {
    const { dateSelected, dates } = this.props;
    const { filters, publicTransportData } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    let { currentFetchDate } = this.state;

    if (!publicTransportData && publicTransportSelected && !dateSelected) {
      return [];
    }

    if (!dateSelected && publicTransportSelected) {
      if (!currentFetchDate) {
        currentFetchDate = getDate();
      } else {
        currentFetchDate = getDate(currentFetchDate);
      }

      currentFetchDate = currentFetchDate.add(1, 'd').format('YYYY-MM-DD');
      this.setState({ currentFetchDate });

      return [currentFetchDate];
    }

    return dates;
  }

  getAfterDate = () => {
    const { dateSelected, fromObj, toObj } = this.props;
    const { currentFetchDate } = this.state;
    const { filters, publicTransportData } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    if (publicTransportSelected && (fromObj.name === '' || toObj.name === '')) {
      return null;
    }

    if (!publicTransportData && publicTransportSelected && !dateSelected) {
      if (currentFetchDate) {
        return currentFetchDate;
      }

      return getDate().format('YYYY-MM-DD');
    }

    return null;
  }

  getLimitValue = () => {
    const { dateSelected, toObj, fromObj } = this.props;
    const { filters } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    if (!dateSelected && publicTransportSelected && toObj.name !== '' && fromObj.name !== '') {
      return null;
    }

    return 10;
  }

  getOffsetValue = () => {
    const { dateSelected, toObj, fromObj } = this.props;
    const { filters, totalTrips } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    if (!dateSelected && publicTransportSelected && toObj.name !== '' && fromObj.name !== '') {
      return null;
    }

    return totalTrips;
  }

  shouldDisplayGroup = () => {
    const { dateSelected, searchAllTrips: { rows, count } } = this.props;
    const { filters, displayGroup, groups, totalTrips } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    if (Object.keys(groups).length < 1 || !filters.includes(FEED_TYPE_GROUP)) {
      return false;
    }

    if (filters.length === 1 && filters.includes(FEED_TYPE_GROUP)) {
      return true;
    }

    if (displayGroup) {
      return true;
    }

    if (rows.length < 1) {
      return true;
    }

    if (publicTransportSelected && dateSelected) {
      return true;
    }

    if (!publicTransportSelected && dateSelected && count >= totalTrips) {
      return true;
    }

    return displayGroup;
  }

  shouldRefetchMore = () => {
    const { dateSelected, searchAllTrips } = this.props;
    const {
      publicTransportEndDate,
      totalTrips,
      publicTransportData,
      publicTransportRemoved,
      filters,
    } = this.state;
    const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

    const fetchDate = this.getFetchDate();

    if (dateSelected && publicTransportSelected) {
      return false;
    }

    if (publicTransportSelected &&
      publicTransportEndDate &&
      !Moment(fetchDate).isBefore(publicTransportEndDate)
    ) {
      return false;
    }

    if (!publicTransportSelected && !dateSelected && totalTrips >= searchAllTrips.count) {
      return false;
    }

    if (!publicTransportSelected && dateSelected && totalTrips >= searchAllTrips.count) {
      return false;
    }

    if (!publicTransportData && publicTransportSelected &&
      searchAllTrips.rows.length > 1 && totalTrips >= searchAllTrips.count) {
      return false;
    }

    if (publicTransportRemoved && totalTrips >= searchAllTrips.count) {
      return false;
    }

    return true;
  }

  redirect = (page) => {
    const { navigation } = this.props;

    navigation.navigate(page);
  }

  refetchTrips = async () => {
    const { filters } = this.state;
    const { searchAllTrips, direction, dateSelected, dates, toObj, fromObj } = this.props;
    const newfilter = filters.filter(row => !(row === FEED_TYPE_GROUP));
    const publicTransportSelected = this.state.filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);
    let customDate = dates;

    if (!dateSelected && publicTransportSelected && toObj.name !== '' && fromObj.name !== '') {
      customDate = [getDate().format('YYYY-MM-DD')];
    }

    await this.setState(
      {
        totalTrips: 0,
        prevTrips: { rows: [] },
        date: null,
        trips: [],
        remainingTrips: [],
        sections: [],
        displayGroup: false,
        currentFetchDate: null,
        publicTransportData: false,
        publicTransportEndDate: null,
        publicTransportRemoved: false,
      },
      () => {
        searchAllTrips.refetch({
          filters: newfilter,
          direction,
          dates: customDate,
          limit: this.getLimitValue(),
          offset: this.getOffsetValue(),
        });
      });
  }

  refetchGroups = async () => {
    const { searchAllGroups, direction } = this.props;

    await this.setState(
      {
        prevGroups: { rows: [] },
        groups: {},
        sections: [],
        totalGroups: 0,
      }, () => {
        searchAllGroups.refetch({
          offset: 0,
          direction,
          limit: 1,
        });
      });
  }

  formatDates() {
    const { dates, dateSelected } = this.props;

    if (dates.length <= 0 || !dateSelected) {
      return trans('search.all_dates_and_times');
    }

    const newDate = [];

    dates.forEach((date) => {
      newDate.push(getDate(date).format('MMM D, HH:mm'));
    });

    return newDate.join(', ');
  }

  prettify = str => (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

  switchResultsStyle = style => this.setState({ resultsStyle: style });

  goBack = () => {
    const { navigation, fromObj, toObj, direction, dateSelected } = this.props;
    const { filters } = this.state;
    let { dates } = this.props;

    if (!dateSelected) {
      dates = [];
    } else {
      dates = dates.map(date => getDate(date).valueOf());
    }

    navigation.navigate('Search', { filters, fromObj, toObj, dates, direction });
  }

  loadMoreGroups = () => {
    const {
      from,
      dates,
      searchAllGroups,
    } = this.props;
    let { to } = this.props;
    const { totalGroups } = this.state;

    if (to && to.length === 0) {
      to = null;
    }

    if (!(searchAllGroups.loading ||
      (totalGroups >= searchAllGroups.count))
      && this.props.filters.includes(FEED_TYPE_GROUP)) {
      searchAllGroups.fetchMore({
        variables: {
          from,
          to,
          dates,
          offset: totalGroups,
          limit: 5,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.groupSearch.rows.length === 0) {
            return previousResult;
          }

          return {
            groupSearch: {
              ...previousResult.groupSearch,
              ...{ rows: fetchMoreResult.groupSearch.rows },
            },
          };
        },
      });
    }
  }

  renderListType = () => {
    const { searchAllTrips, searchAllGroups } = this.props;
    const { filters } = this.state;

    if (filters.length === 1 && filters.includes(FEED_TYPE_GROUP)) {
      return null;
    }

    if ((searchAllTrips.count > 0 || searchAllGroups.count > 0)
      && !filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)
    ) {
      return (
        <View style={styles.switchViewWrapper}>
          <TouchableOpacity
            style={[styles.viewSwitcher, styles.cardSwitch, this.state.resultsStyle === 'card' ? styles.selected : {}]}
            onPress={() => this.switchResultsStyle('card')}
            activeOpacity={0.8}
          >
            <Text style={[this.state.resultsStyle === 'card' ? styles.whiteText : styles.lightText]}>{trans('search.cards')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewSwitcher, styles.listSwitch, this.state.resultsStyle === 'list' ? styles.selected : {}]}
            onPress={() => this.switchResultsStyle('list')}
            activeOpacity={0.8}
          >
            <Text style={[this.state.resultsStyle === 'list' ? styles.whiteText : styles.lightText]}>{trans('search.list')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  renderSectionHeader = (title) => {
    if (this.state.resultsStyle === 'list') {
      return (
        <View style={styles.sectionHeaderWrapper}>
          <AppText style={styles.sectionHeader}>{title === 'Group' ? 'Groups' : title}</AppText>
          {title !== 'Group' &&
            <View style={[styles.indicators, styles.flexRow]}>
              <View style={[styles.flexRow, styles.indicatorWrapper]}>
                <View style={[styles.indicator, styles.pink]} /><Text>{trans('search.offered_ride')}</Text>
              </View>
              <View style={[styles.flexRow, styles.indicatorWrapper]}>
                <View style={[styles.indicator, styles.blue]} /><Text>{trans('search.ride_that_is_asked_for')}</Text>
              </View>
            </View>
          }
        </View>
      );
    }

    return null;
  }

  renderSectionFooter = (title) => {
    const { totalGroups } = this.state;
    const { searchAllGroups: { loading, count } } = this.props;
    const groupCount = count - totalGroups;

    return (
      <View style={styles.sectionDivider}>
        {title === 'Group' && loading &&
          <Loading style={{ marginBottom: 16 }} />
        }
        {title === 'Group' && !loading &&
          groupCount > 0 &&
          <LoadMore
            onPress={() => this.loadMoreGroups()}
            remainingCount={groupCount}
            style={{ height: 60 }}
          />
        }
      </View>
    );
  }

  renderFooter = () => {
    const { searchAllTrips } = this.props;
    if (searchAllTrips.loading) {
      return (<Loading style={{ marginVertical: 32 }} />);
    }

    return null;
  }

  renderSearchResult = () => {
    const {
      from,
      fromObj,
      toObj,
      direction,
      searchAllTrips,
      searchAllGroups,
    } = this.props;
    let { to } = this.props;
    const { sections, filters } = this.state;
    const namePlace = `${fromObj.name || this.prettify(direction)} - ${toObj.name || this.prettify(direction)}`;

    if (
      !searchAllTrips.loading && (searchAllTrips.rows.length < 1 ||
        (!filters.includes(FEED_TYPE_OFFER) && !filters.includes(FEED_TYPE_WANTED)
          && !filters.includes(FEED_TYPE_PUBLIC_TRANSPORT))
      )
      && !searchAllGroups.loading &&
      (searchAllGroups.rows.length < 0 || !filters.includes(FEED_TYPE_GROUP))
    ) {
      return (
        <NoResult
          filters={filters}
          search={searchAllTrips}
          renderRoundButton={this.renderRoundButton}
          namePlace={namePlace}
        />
      );
    }

    return (
      <AnimatedSectionList
        sections={sections}
        renderItem={({ item }) => (
          <SearchItem
            key={item.id}
            onSharePress={() => this.setState({ showShareModal: true })}
            onPress={this.onPress}
            searchResult={item}
            resultsStyle={this.state.resultsStyle}
            displayGroup={this.shouldDisplayGroup()}
          />
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedValue } } }])}
        keyExtractor={(item, index) => index}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section.title)}
        renderSectionFooter={({ section }) => this.renderSectionFooter(section.title)}
        onEndReachedThreshold={0.01}
        ListHeaderComponent={this.renderListType}
        ListFooterComponent={this.renderFooter}
        refreshing={false}
        bounces={false}
        onRefresh={() => {
          if (this.state.filters.includes(FEED_TYPE_GROUP)) {
            this.refetchGroups();
          }
          if (this.state.filters.includes(FEED_TYPE_OFFER) ||
            this.state.filters.includes(FEED_TYPE_OFFER) ||
            this.state.filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)
          ) {
            this.refetchTrips();
          }
        }}
        onEndReached={() => {
          if (searchAllTrips.loading || searchAllGroups.loading) {
            return;
          }

          if (to && to.length === 0) {
            to = null;
          }

          const fetchDate = this.getFetchDate();
          const { publicTransportData } = this.state;
          const publicTransportSelected = this.state.filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

          if (!(searchAllTrips.loading) &&
            (this.state.filters.includes(FEED_TYPE_OFFER)
              || this.state.filters.includes(FEED_TYPE_WANTED)
              || publicTransportSelected
            ) &&
            this.shouldRefetchMore()) {
            let updatedFilters = this.state.filters.filter(row => !(row === FEED_TYPE_GROUP));

            if (publicTransportSelected && !publicTransportData) {
              updatedFilters = updatedFilters.filter(row => row !== FEED_TYPE_PUBLIC_TRANSPORT);
              this.setState({ publicTransportRemoved: true });
            }

            searchAllTrips.fetchMore({
              variables: {
                from,
                to,
                filters: updatedFilters,
                dates: fetchDate,
                limit: this.getLimitValue(),
                offset: this.getOffsetValue(),
                afterDate: this.getAfterDate(),
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.tripSearch.rows.length === 0) {
                  return previousResult;
                }
                return {
                  tripSearch: {
                    ...previousResult.tripSearch,
                    ...{
                      rows: fetchMoreResult.tripSearch.rows,
                      count: fetchMoreResult.tripSearch.count,
                    },
                  },
                };
              },
            });
          }
        }}
      />
    );
  }

  renderRoundButton = (redirectPage, text) => (
    <RoundedButton
      bgColor={Colors.background.pink}
      onPress={() => this.redirect(redirectPage)}
      style={styles.button}
    >{text}</RoundedButton>
  )

  renderShareModal() {
    const { showShareModal, Shareable, shareableType } = this.state;

    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={shareableType}
          detail={Shareable}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  render() {
    const { fromObj: from, toObj: to, direction, searchAllTrips } = this.props;
    const { filters } = this.state;

    let y = 0;
    y = this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });

    return (
      <Wrapper>
        <View style={styles.searchContent}>
          <View style={styles.header}>
            <View style={[styles.flexRow, styles.backRow]}>
              <FloatingBackButton onPress={this.goBack} />
              <TouchableWithoutFeedback onPress={this.goBack}>
                <View style={styles.fromRow}>
                  <Text>{from.name || this.prettify(direction) || trans('global.anywhere')}</Text>
                  <Text style={[styles.lightText, styles.bold]}>{trans('global.from')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Animated.View style={[styles.animatedRow, { marginTop: y }]}>
              <TouchableWithoutFeedback onPress={this.goBack}>
                <View style={styles.toRow}>
                  <Text>{to.name || this.prettify(direction) || trans('global.anywhere')}</Text>
                  <Text style={[styles.lightText, styles.bold]}>{trans('global.to')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.goBack}>
                <View>
                  <Text style={styles.time}>{this.formatDates()}</Text>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
          <View style={styles.suggestionsContainer}>
            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_OFFER)}
              style={[
                styles.suggestion,
                filters.includes(FEED_TYPE_OFFER) && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.offered')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_WANTED)}
              style={[
                styles.suggestion,
                filters.includes(FEED_TYPE_WANTED) && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.asked_for')}</Text>
            </TouchableOpacity>

            <View
              style={{ overflow: 'visible' }}
              onLayout={
                event => (
                  this.setArrowOffset(event.nativeEvent.layout.x, event.nativeEvent.layout.width)
                )
              }
            >
              <TouchableOpacity
                onPress={() => this.onFilterSelect(FEED_TYPE_PUBLIC_TRANSPORT)}
                style={[
                  styles.suggestion,
                  filters.includes(FEED_TYPE_PUBLIC_TRANSPORT) && styles.selected,
                ]}
              >
                <Text style={styles.whiteText}>{trans('search.public_transport')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_GROUP)}
              style={[
                styles.suggestion,
                filters.includes(FEED_TYPE_GROUP) && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.groups')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          (
            !searchAllTrips.loading
            && searchAllTrips.rows.length < 1
            && filters.length === 1
            && (filters.includes(FEED_TYPE_OFFER))
          )
          &&
          <View style={[styles.arrowContainer, { paddingLeft: this.state.arrowX }]}>
            <Image source={require('@assets/icons/ic_arrow_up.png')} style={styles.arrow} />
          </View>
        }
        {this.renderSearchResult()}
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

SearchResult.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        refetch: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  dates: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.arrayOf(PropTypes.string),
  from: PropTypes.arrayOf(PropTypes.number).isRequired,
  to: PropTypes.arrayOf(PropTypes.number).isRequired,
  fromObj: PropTypes.shape({
    coordinates: PropTypes.array,
    name: PropTypes.string,
    countryCode: PropTypes.string,
  }).isRequired,
  toObj: PropTypes.shape({
    coordinates: PropTypes.array,
    name: PropTypes.string,
    countryCode: PropTypes.string,
  }).isRequired,
  direction: PropTypes.string,
  searchAllGroups: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
  }).isRequired,
  searchAllTrips: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
  }),
  dateSelected: PropTypes.bool.isRequired,
};

SearchResult.defaultProps = {
  dates: [],
  filters: [],
  direction: '',
  groupFilter: true,
  searchAllTrips: { loading: false, networkStatus: 4, rows: [], count: 0 },
};

export default compose(withShare, withNavigation)(SearchResult);
