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
      offset: 0,
      groupOffset: 0,
      groupOffsetArray: [],
      sections: [],
      prevGroups: {},
      prevTrips: {},
      filters: [],
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

    if (searchAllGroups && !searchAllGroups.loading && searchAllGroups.rows.length > 0) {
      if (Object.keys(this.state.prevGroups).length < 1) {
        await this.setState({ prevGroups: searchAllGroups });
      } else {
        let groupRepeated = false;
        searchAllGroups.rows.forEach((newGroup) => {
          this.state.groups.data.forEach((prevGroup) => {
            if (prevGroup.id === newGroup.id) {
              groupRepeated = true;
            }
          });
        });

        if (!groupRepeated) {
          await this.setState({
            prevGroups: {
              ...searchAllGroups,
              ...{ rows: this.state.prevGroups.rows.concat(searchAllGroups.rows) },
            },
          });
        }
      }

      const groups = {
        title: 'Group',
        data: searchAllGroups.rows,
      };


      if (filters.includes(FEEDABLE_GROUP) && filters.length === 1) {
        this.state.sections = this.state.groups.concat([groups]);
      }

      await this.setState({ groups });
    }

    if (searchAllTrips && !searchAllTrips.loading) {
      const { sections } = this.state;
      let filteredTrips = [];

      if (Object.keys(this.state.prevTrips).length < 1) {
        filteredTrips = searchAllTrips.rows;
        await this.setState({ prevTrips: searchAllTrips });
      } else {
        searchAllTrips.rows.forEach((newTrip) => {
          let repeated = false;
          this.state.prevTrips.rows.forEach((prevTrip) => {
            if (newTrip.id === prevTrip.id) {
              repeated = true;
            }
          });
          if (!repeated) {
            filteredTrips.push(newTrip);
          }
        });

        this.setState({
          prevTrips: {
            ...searchAllTrips,
            ...{ rows: this.state.prevTrips.rows.concat(filteredTrips) },
          },
        });
      }

      let newSections = this.state.sections;

      const tripsObj = filteredTrips.reduce((r, a) => {
        let title = new Date(a.date);
        title = Moment(title).format('MMM D, YYYY');
        r[title] = r[title] || [];
        r[title].push(a);

        return r;
      }, Object.create(null));

      let trips = [];

      if (Object.keys(tripsObj).length > 0) {
        trips = Object.keys(tripsObj).map(key => ({ title: key, data: tripsObj[key] }));
      }

      const lastSection = newSections[newSections.length - 1];

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

      await this.setState({ trips });

      if (Object.keys(this.state.groups).length > 0 &&
        this.props.filters.includes(FEED_TYPE_GROUP)) {
        let groupRepeated = false;

        newSections.forEach((section) => {
          if (section.title === 'Group') {
            section.data.forEach((group) => {
              this.state.groups.data.forEach((newGroup) => {
                if (newGroup.id === group.id) {
                  groupRepeated = true;
                }
              });
            });
          }
        });

        if (!groupRepeated && this.state.groups) {
          if (lastSection && lastSection.title === 'Group' && newSections.length > 0) {
            newSections[newSections.length - 1].data = newSections[newSections.length - 1]
              .data.concat(this.state.groups.data);
          } else {
            newSections = newSections.concat(this.state.groups);
          }
        }
      }

      await this.setState({ sections: newSections, offset: sections.length });
    }
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: detail });
    }
  };

  onFilterSelect = (param) => {
    const { filters } = this.state;

    if (filters.includes(param)) {
      filters.splice(filters.indexOf(param), 1);
    } else {
      filters.push(param);
    }

    if (filters.includes(FEED_TYPE_PUBLIC_TRANSPORT)) {
      this.setState({ resultsStyle: 'list' });
    }

    if (filters.length > 0) {
      this.setState({ filters });

      if (filters.includes(FEED_TYPE_OFFER) || filters.includes(FEED_TYPE_WANTED)) {
        this.refetchTrips();
      }

      if (filters.includes(FEED_TYPE_GROUP)) {
        this.refetchGroups();
      }
    }
  }

  setArrowOffset = (x, width) => {
    const xOffset = x + 20 + (width / 2);
    this.setState({ arrowX: xOffset });
  }

  redirect = (page) => {
    const { navigation } = this.props;

    navigation.navigate(page);
  }

  refetchTrips = async () => {
    const { filters } = this.state;
    const { searchAllTrips, direction } = this.props;
    const newfilter = filters.filter(row => !(row === FEED_TYPE_GROUP));

    await this.setState({ prevTrips: [], trips: [], sections: [] }, () => {
      searchAllTrips.refetch({
        filters: newfilter,
        offset: 0,
        direction,
      });
    });
  }

  refetchGroups = async () => {
    const { searchAllGroups, direction } = this.props;

    await this.setState({ prevGroups: [], groups: {}, sections: [] }, () => {
      searchAllGroups.refetch({
        offset: 0,
        direction,
      });
    });
  }

  formatDates() {
    const { dates } = this.props;

    if (dates.length <= 0) {
      return trans('search.all_dates_and_times');
    }

    const newDate = [];

    dates.forEach((date) => {
      newDate.push(Moment(date).format('MMM D'));
    });

    return newDate.join(', ');
  }

  prettify = str => (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

  switchResultsStyle = style => this.setState({ resultsStyle: style });

  goBack = () => {
    const { navigation, filters, fromObj, toObj, dates, direction } = this.props;

    navigation.navigate('Search', { filters, fromObj, toObj, dates, direction });
  }

  renderListType = () => {
    const { searchAllTrips, searchAllGroups, filters } = this.props;

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
          <Text style={styles.sectionHeader}>{title === 'Group' ? 'Groups' : title}</Text>
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

  renderSectionFooter = () => <View style={styles.sectionDivider} />;

  renderFooter = () => {
    const { searchAllGroups, searchAllTrips } = this.props;
    if (searchAllGroups.loading || searchAllTrips.loading) {
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
      filters,
      dates,
      searchAllTrips,
      searchAllGroups,
    } = this.props;
    let { to } = this.props;
    const { sections } = this.state;
    const namePlace = `${fromObj.name || this.prettify(direction)} - ${toObj.name || this.prettify(direction)}`;

    if (!searchAllTrips.loading && searchAllTrips.count === 0
      && !searchAllGroups.loading && searchAllGroups.count === 0
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
          />
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedValue } } }])}
        keyExtractor={(item, index) => index}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section.title)}
        renderSectionFooter={this.renderSectionFooter}
        onEndReachedThreshold={0.8}
        ListHeaderComponent={this.renderListType}
        ListFooterComponent={this.renderFooter}
        refreshing={false}
        onRefresh={() => {
          if (this.state.filters.includes(FEED_TYPE_GROUP)) {
            this.refetchGroups();
          }
          if (this.state.filters.includes(FEED_TYPE_OFFER) ||
            this.state.filters.includes(FEED_TYPE_OFFER)) {
            this.refetchTrips();
          }
        }}
        onEndReached={() => {
          const { prevTrips, prevGroups } = this.state;
          if (searchAllTrips.loading ||
            (prevTrips.rows && prevTrips.rows.length >= prevTrips.count)) {
            if (searchAllGroups.loading || searchAllGroups.rows.length >= searchAllGroups.count) {
              return;
            }
          }

          if (to && to.length === 0) {
            to = null;
          }

          if (!(searchAllTrips.loading ||
            (prevTrips.rows && prevTrips.rows.length >= prevTrips.count))
            && (this.props.filters.includes(FEED_TYPE_OFFER)
              || this.props.filters.includes(FEED_TYPE_WANTED))) {
            const updatedFilters = filters.filter(row => !(row === FEED_TYPE_GROUP));
            searchAllTrips.fetchMore({
              variables: {
                from,
                to,
                filters: updatedFilters,
                dates,
                offset: searchAllTrips.rows.length,
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.tripSearch.rows.length === 0) {
                  return previousResult;
                }

                return {
                  tripSearch: {
                    ...previousResult.tripSearch,
                    ...{ rows: fetchMoreResult.tripSearch.rows },
                  },
                };
              },
            });
          }

          if (!(searchAllGroups.loading ||
            (prevGroups.rows && prevGroups.rows.length >= prevGroups.count))
            && this.props.filters.includes(FEED_TYPE_GROUP)) {
            searchAllGroups.fetchMore({
              variables: {
                from,
                to,
                dates,
                offset: searchAllGroups.rows.length,
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
};

SearchResult.defaultProps = {
  dates: [],
  filters: [],
  direction: '',
  groupFilter: true,
  searchAllTrips: { loading: false, networkStatus: 4, rows: [], count: 0 },
};

export default compose(withShare, withNavigation)(SearchResult);
