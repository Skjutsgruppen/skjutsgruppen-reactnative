import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import ListItem from '@components/profile/listItem';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    padding: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
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

const SearchMyConversations = ({ conversations, onPress, onExperiencePress, queryString }) => {
  if (queryString.length < 1) {
    return null;
  }

  if (conversations.loading) {
    return (<View style={styles.wrapper}><Loading /></View>);
  }

  if (conversations.count === 0) {
    return (<View style={styles.wrapper}>
      <Text style={styles.text}>No search data.</Text></View>);
  }

  return (
    <DataList
      data={conversations}
      renderItem={({ item }) => (
        <ListItem
          trip={item}
          onExperiencePress={onExperiencePress}
          onPress={onPress}
        />
      )}
      fetchMoreOptions={{
        variables: { offset: conversations.rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.conversations.rows.length === 0) {
            return previousResult;
          }

          const rows = previousResult.conversations.rows.concat(fetchMoreResult.conversations.rows);

          return { conversations: { ...previousResult.conversations, ...{ rows } } };
        },
      }}
    />
  );
};

SearchMyConversations.propTypes = {
  conversations: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
    refetch: PropTypes.func,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onExperiencePress: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired,
};

export default SearchMyConversations;
