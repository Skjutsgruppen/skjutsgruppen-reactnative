import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { withMyGroups } from '@services/apollo/group';
import { withNotificationSearch } from '@services/apollo/notification';
import MesssageItem from '@components/message/item';
import ActiveGroupItem from '@components/message/ActiveGroupItem';
import { trans } from '@lang/i18n';
import { Loading } from '@components/common';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  absoluteItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const SearchList = ({ searchMessages, groups }) => {
  if (searchMessages.loading || groups.loading) {
    return (
      <View style={styles.absoluteItem}>
        <Loading />
      </View>
    );
  }

  if ((searchMessages.count + groups.count) <= 0) {
    return (
      <View style={styles.absoluteItem}>
        <AppText color="#bbbbbb">{trans('search.no_search_results')}</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={searchMessages.rows}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MesssageItem
          filters={'filters'}
          notification={item}
        />
      )}
      ListHeaderComponent={() => (
        <View>
          {
            groups.rows.map(item => (item.isBlocked ?
              null :
              <ActiveGroupItem key={item.id} group={item} />))
          }
        </View>
      )}
      ListFooterComponent={
        searchMessages.loading || (searchMessages.networkStatus === 1 && searchMessages.rows.length < 1) ?
          <Loading />
          : null
      }
      onEndReachedThreshold={0.9}
      onEndReached={() => {
        const fetchMoreOptions = {
          variables: { offset: searchMessages.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.searchMessages.rows.length === 0) {
              return previousResult;
            }
            const rows = previousResult.searchMessages.rows.concat(fetchMoreResult.searchMessages.rows);
            return { searchMessages: { ...previousResult.searchMessages, ...{ rows } } };
          },
        };
        if (searchMessages.loading || searchMessages.rows.length >= searchMessages.count || !fetchMoreOptions) {
          return;
        }
        searchMessages.fetchMore(fetchMoreOptions);
      }}
    />
  );
};

SearchList.propTypes = {
  searchMessages: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    rows: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    refetch: PropTypes.func.isRequired,
    networkStatus: PropTypes.number.isRequired,
  }).isRequired,
  groups: PropTypes.shape({
    rows: PropTypes.array,
    loading: PropTypes.bool,
    count: PropTypes.number,
  }).isRequired,
};

export default compose(withMyGroups, withNotificationSearch)(SearchList);
