import React from 'react';
import { withSearch } from '@services/apollo/search';
import PropTypes from 'prop-types';
import Result from '@components/search/searchResult';

const SearchResult = withSearch(Result);

const Search = ({ navigation }) => {
  const { from, to, direction, filters, dates } = navigation.state.params;

  return (
    <SearchResult
      navigation={navigation}
      from={from}
      to={to}
      direction={direction}
      fromCoords={from.coordinates}
      toCoords={to.coordinates}
      filters={filters}
      dates={dates}
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
