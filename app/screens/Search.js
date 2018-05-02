import React from 'react';
import { withSearchAllTrips, withSearchAllGroups } from '@services/apollo/search';
import PropTypes from 'prop-types';
import SearchResult from '@components/search/SearchResult';
import { compose } from 'react-apollo';
import { getDate } from '@config';
import { FEED_TYPE_PUBLIC_TRANSPORT } from '@config/constant';

const AllSearchResult = compose(withSearchAllTrips, withSearchAllGroups)(SearchResult);

const Search = ({ navigation }) => {
  const { from, to, direction, filters, dates } = navigation.state.params;
  let dateSelected = true;
  let limit = 0;
  let offset = 0;
  const publicTransportSelected = filters.includes(FEED_TYPE_PUBLIC_TRANSPORT);

  if (dates.length < 1) {
    dateSelected = false;
    if (publicTransportSelected && to.name !== '' && from.name !== '') {
      dates.push(getDate().format('YYYY-MM-DD'));
    }
  }

  if (!dateSelected && !publicTransportSelected) {
    limit = 10;
    offset = 0;
  }

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
      dateSelected={dateSelected}
      limit={limit}
      offset={offset}
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
