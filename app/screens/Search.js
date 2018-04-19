import React from 'react';
import { withSearchAllTrips, withSearchAllGroups } from '@services/apollo/search';
import PropTypes from 'prop-types';
import SearchResult from '@components/search/searchResult';
import { compose } from 'react-apollo';

const AllSearchResult = compose(withSearchAllTrips, withSearchAllGroups)(SearchResult);

const Search = ({ navigation }) => {
  const { from, to, direction, filters, dates } = navigation.state.params;

  return (
    <AllSearchResult
      from={from.coordinates}
      to={to.coordinates}
      direction={direction}
      fromObj={from}
      toObj={to}
      filters={filters}
      dates={dates}
      fromPlace={from}
      toPlace={to}
    />
  );
};

Search.navigationOptions = {
  header: null,
};

Search.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

export default Search;
