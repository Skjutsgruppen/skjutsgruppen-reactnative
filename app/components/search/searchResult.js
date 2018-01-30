import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import Moment from 'moment';
import { Wrapper, FloatingNavbar, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import SearchItem from '@components/search/searchItem';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/share';
import { trans } from '@lang/i18n';
import DataList from '@components/dataList';
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

const styles = StyleSheet.create({
  navBar: {
    height: 40,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  searchContent: {
    padding: 24,
    backgroundColor: Colors.background.fullWhite,
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
  selected: {
    backgroundColor: Colors.background.blue,
  },
  whiteText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  switchViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 24,
  },
  viewSwitcher: {
    height: 22,
    paddingHorizontal: 20,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 16,
    justifyContent: 'center',
  },
  button: {
    width: '60%',
    paddingHorizontal: 16,
    marginTop: 32,
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
    this.state = { filters: [], modalDetail: {}, modalType: '', isOpen: false, resultsStyle: 'card' };
  }

  componentWillMount() {
    const { filters } = this.props;
    this.setState({ filters });
    if (filters.indexOf(FEED_TYPE_PUBLIC_TRANSPORT) > -1) {
      this.setState({ resultsStyle: 'list' });
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

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== FEED_TYPE_GROUP });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };


  onClose = () => {
    this.setState({ isOpen: false });
  }

  onFilterSelect = (param) => {
    const { filters } = this.state;

    if (filters.indexOf(param) > -1) {
      filters.splice(filters.indexOf(param), 1);
    } else {
      filters.push(param);
    }

    this.setState({ filters });
    this.refetch();
  }

  redirect = (page) => {
    const { navigation } = this.props;

    navigation.navigate(page);
  }

  refetch = () => {
    const { filters } = this.state;
    const { from, to, dates, search } = this.props;

    search.refetch({
      variables: {
        from,
        to,
        dates,
        dateRange: [],
        filters,
        offset: 0,
      },
    });
  }

  formatDates() {
    const { dates } = this.props;
    const newDate = [];

    dates.forEach((date) => {
      newDate.push(Moment(date).format('MMM D'));
    });

    return newDate;
  }

  prettify = str => (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

  switchResultsStyle = style => this.setState({ resultsStyle: style });

  renderListType = () => (
    <View style={styles.switchViewWrapper}>
      <TouchableOpacity
        style={[styles.viewSwitcher, this.state.resultsStyle === 'card' ? styles.selected : {}]}
        onPress={() => this.switchResultsStyle('card')}
      >
        <Text style={styles.whiteText}>{trans('search.cards')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.viewSwitcher, this.state.resultsStyle === 'list' ? styles.selected : {}]}
        onPress={() => this.switchResultsStyle('list')}
      >
        <Text style={styles.whiteText}>{trans('search.list')}</Text>
      </TouchableOpacity>
    </View>
  );

  renderSearchResult = () => {
    const { from, fromObj, toObj, direction, to, filters, dates, search } = this.props;
    const namePlace = `${fromObj.name} - ${toObj.name || this.prettify(direction)}`;

    if (!search.loading && search.count === 0) {
      return (
        <NoResult
          filters={filters}
          search={search}
          renderRoundButton={this.renderRoundButton}
          namePlace={namePlace}
        />
      );
    }

    return (
      <DataList
        data={search}
        renderItem={({ item }) => (
          <SearchItem
            key={item.id}
            onSharePress={this.onSharePress}
            onPress={this.onPress}
            searchResult={item}
            resultsStyle={this.state.resultsStyle}
          />
        )}
        fetchMoreOptions={{
          variables: { from, to, filters, dates, offset: search.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.search.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.search.rows.concat(fetchMoreResult.search.rows);

            return { search: { ...previousResult.search, ...{ rows } } };
          },
        }}
      />
    );
  };

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup={this.state.modalType !== FEED_TYPE_GROUP}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  renderRoundButton = (redirectPage, text) => (
    <RoundedButton
      bgColor={Colors.background.pink}
      onPress={() => this.redirect(redirectPage)}
      style={styles.button}
    >{text}</RoundedButton>
  )

  render() {
    const { fromObj: from, toObj: to, direction, filters, navigation, search } = this.props;

    const prettyDate = this.formatDates();

    return (
      <Wrapper bgColor={Colors.background.lightBlueWhite}>
        <FloatingNavbar handleBack={() => navigation.goBack()} />
        <View style={styles.searchContent}>
          <View style={{ marginLeft: 40 }}>
            <Text style={styles.bold}>{from.name} - {to.name || this.prettify(direction) || 'Anywhere'}</Text>
            <Text style={styles.time}>{prettyDate.join(', ')}</Text>
          </View>
          <View style={styles.suggestionsContainer}>
            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_OFFER)}
              style={[
                styles.suggestion,
                filters.indexOf(FEED_TYPE_OFFER) > -1 && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.offered')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_WANTED)}
              style={[
                styles.suggestion,
                filters.indexOf(FEED_TYPE_WANTED) > -1 && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.asked_for')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_PUBLIC_TRANSPORT)}
              style={[
                styles.suggestion,
                filters.indexOf(FEED_TYPE_PUBLIC_TRANSPORT) > -1 && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.public_transport')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_GROUP)}
              style={[
                styles.suggestion,
                filters.indexOf(FEED_TYPE_GROUP) > -1 && styles.selected,
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.groups')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {search.count > 0 && this.renderListType()}
        {this.renderSearchResult()}
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

SearchResult.propTypes = {
  share: PropTypes.func.isRequired,
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
  search: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
  }).isRequired,
};

SearchResult.defaultProps = {
  dates: [],
  filters: [],
  direction: '',
};

export default compose(withShare, withNavigation)(SearchResult);
