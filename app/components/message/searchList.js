import React from 'react';
import PropTypes from 'prop-types';
import { withNotificationSearch } from '@services/apollo/notification';
import MesssageItem from '@components/message/item';
import DataList from '@components/dataList';

const SearchList = ({ searchMessages }) => (
  <DataList
    data={searchMessages}
    renderItem={({ item }) => (
      <MesssageItem
        filters={'filters'}
        notification={item}
        key={item.id}
      />
    )}
    fetchMoreOptions={{
      variables: { offset: searchMessages.rows.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.searchMessages.rows.length === 0) {
          return previousResult;
        }

        const rows = previousResult.searchMessages.rows.concat(fetchMoreResult.searchMessages.rows);

        return { searchMessages: { ...previousResult.searchMessages, ...{ rows } } };
      },
    }}
  />
);

SearchList.propTypes = {
  searchMessages: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    rows: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    refetch: PropTypes.func.isRequired,
    networkStatus: PropTypes.number.isRequired,
  }).isRequired,
};

export default withNotificationSearch(SearchList);
