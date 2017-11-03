import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import Moment from 'moment';
import { Wrapper, Loading } from '@components/common';
import BackButton from '@components/common/backButton';
import Colors from '@theme/colors';
import SearchItem from '@components/search/searchItem';

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
    this.state = {
      filters: [],
    };
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
  };

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== 'group' });
  };

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

  renderHeader = () => (
    <View style={styles.switchViewWrapper}>
      <TouchableOpacity style={[styles.viewSwitcher, styles.selected]}>
        <Text style={styles.whiteText}>Cards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewSwitcher}>
        <Text style={styles.whiteText}>List</Text>
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
        />)}
        keyExtractor={(item, index) => index}
        refreshing={search.networkStatus === 4}
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

  render() {
    const { from, to, filters, navigation, search } = this.props;

    if (search.networkStatus === 1) {
      return <Loading />;
    }

    const prettyDate = this.formatDates();

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.navBar}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.searchContent}>
          <Text style={styles.bold}>{from.name} - {to.name}</Text>
          <Text style={styles.time}>{prettyDate.join(', ')}</Text>
          <View style={styles.suggestionsContainer}>
            <TouchableOpacity onPress={() => this.onFilterSelect('offered')} style={[styles.suggestion, filters.indexOf('offered') > -1 ? styles.selected : {}]}>
              <Text style={styles.whiteText}>Offered</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('wanted')} style={[styles.suggestion, filters.indexOf('wanted') > -1 ? styles.selected : {}]}>
              <Text style={styles.whiteText}>Asked for</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('public')} style={[styles.suggestion, filters.indexOf('public') > -1 ? styles.selected : {}]}>
              <Text style={styles.whiteText}>Public transport</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onFilterSelect('group')} style={[styles.suggestion, filters.indexOf('group') > -1 ? styles.selected : {}]}>
              <Text style={styles.whiteText}>Groups</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderSearchResult()}
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
  from: PropTypes.shape({
    coordinates: PropTypes.array,
    name: PropTypes.string,
    countryCode: PropTypes.string,
  }).isRequired,
  to: PropTypes.shape({
    coordinates: PropTypes.array,
    name: PropTypes.string,
    countryCode: PropTypes.string,
  }).isRequired,
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
};

export default SearchResult;
