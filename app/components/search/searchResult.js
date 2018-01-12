import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import Moment from 'moment';
import { Wrapper, FloatingNavbar, Loading } from '@components/common';
import Colors from '@theme/colors';
import SearchItem from '@components/search/searchItem';
import Share from '@components/common/share';
import { compose } from 'react-apollo';
import { withShare } from '@services/apollo/auth';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';
import { trans } from '@lang/i18n';

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
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;
    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === 'offer') {
      navigation.navigate('OfferDetail', { offer: detail });
    }

    if (type === 'ask') {
      navigation.navigate('AskDetail', { ask: detail });
    }

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }
  };

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== 'group' });
  };


  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
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

  renderHeader = () => (
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

  renderFooter = () => {
    const { loading, search: { rows, count } } = this.props.search;

    if (!loading) return null;

    if (rows.length === 0) {
      return (<Text style={styles.time}>{count} {count <= 1 ? 'result' : 'results'} found</Text>);
    }

    if (rows.length > 20 && rows.length >= count) {
      return (
        <View
          style={{
            paddingVertical: 120,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        />
      );
    }

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <Loading />
      </View>
    );
  }

  renderSearchResult = () => {
    const { from, to, filters, dates, search } = this.props;

    if (search.networkStatus === 1) {
      return <Loading />;
    }

    if (search.error) {
      return <Text>Error: {search.error.message}</Text>;
    }

    const { rows, count } = search.search;

    return (
      <FlatList
        data={rows}
        renderItem={({ item }) => (<SearchItem
          key={item.id}
          onSharePress={this.onSharePress}
          onPress={this.onPress}
          searchResult={item}
          resultsStyle={this.state.resultsStyle}
        />)}
        keyExtractor={(item, index) => index}
        refreshing={search.networkStatus === 4 || search.networkStatus === 2}
        onRefresh={() => search.refetch()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (search.loading || rows.length >= count) return;

          search.fetchMore({
            variables: {
              from,
              to,
              filters,
              dates,
              offset: rows.length,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }
              const updatedSearchResult = previousResult.search.rows.concat(
                fetchMoreResult.search.rows,
              );

              return { search: { rows: updatedSearchResult } };
            },
          });
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
            showGroup={this.state.modalType !== 'group'}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

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
                filters.indexOf(FEED_TYPE_OFFER) > -1 ? styles.selected : {},
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.offered')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect(FEED_TYPE_WANTED)}
              style={[
                styles.suggestion,
                filters.indexOf(FEED_TYPE_WANTED) > -1 ? styles.selected : {},
              ]}
            >
              <Text style={styles.whiteText}>{trans('search.asked_for')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect('public')}
              style={[styles.suggestion, filters.indexOf('public') > -1 ? styles.selected : {}]}
            >
              <Text style={styles.whiteText}>{trans('search.public_transport')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFilterSelect('group')}
              style={[styles.suggestion, filters.indexOf('group') > -1 ? styles.selected : {}]}
            >
              <Text style={styles.whiteText}>{trans('search.groups')}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    search: PropTypes.shape({
      rows: PropTypes.arrayOf(PropTypes.object),
      count: PropTypes.number,
    }),
  }).isRequired,
};

SearchResult.defaultProps = {
  dates: [],
  filters: [],
  direction: '',
};

export default compose(withShare)(SearchResult);
