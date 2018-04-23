import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import GroupsItem from '@components/profile/groupsItem';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    padding: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    textAlign: 'center',
    color: Colors.text.gray,
    marginVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
    height: 80,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 16,
    marginRight: 16,
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
});

const SearchExploreGroups = ({ searchGroup, onPress, queryString }) => {
  if (queryString.length < 1) {
    return null;
  }

  if (searchGroup.loading) {
    return (<View style={styles.wrapper}><Loading /></View>);
  }

  if (searchGroup.count === 0) {
    return (<View style={styles.wrapper}>
      <AppText style={styles.text}>No search data.</AppText></View>);
  }

  return (
    <DataList
      data={searchGroup}
      renderItem={({ item }) => (
        <GroupsItem
          key={item.id}
          group={item}
          onPress={onPress}
        />
      )}
      fetchMoreOptions={{
        variables: { offset: searchGroup.rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.searchGroup.rows.length === 0) {
            return previousResult;
          }

          const rows = previousResult.searchGroup.rows.concat(fetchMoreResult.searchGroup.rows);

          return { searchGroup: { ...previousResult.searchGroup, ...{ rows } } };
        },
      }}
    />
  );
};

SearchExploreGroups.propTypes = {
  searchGroup: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired,
};

export default SearchExploreGroups;
