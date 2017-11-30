import React, { PureComponent } from 'react';
import GroupItem from '@components/feed/card/group';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';
import { Loading } from '@components/common';

class SearchGroupResult extends PureComponent {
  redirect = (type, detail) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { group: detail });
  }

  renderFooter = () => {
    const { loading, searchGroup: { rows: Group, count } } = this.props.searchGroups;

    if (!loading) return null;

    if (Group.length >= count) {
      return (
        <View
          style={{
            paddingVertical: 60,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        />
      );
    }

    return (
      <View
        style={{
          paddingVertical: 60,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <Loading />
      </View>
    );
  }

  renderSearchGroupList() {
    const { searchGroups, keyword } = this.props;
    const { searchGroup: { rows: Group, count } } = searchGroups;
    return (
      <FlatList
        data={Group}
        renderItem={({ item }) => (<GroupItem
          min
          onPress={this.redirect}
          key={item.id}
          group={item}
        />)}
        keyExtractor={(item, index) => index}
        refreshing={searchGroups.networkStatus === 4}
        onRefresh={() => searchGroups.refetch()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (searchGroups.loading || Group.length >= count) return;

          searchGroups.fetchMore({
            variables: { keyword, offset: Group.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.searchGroup.length === 0) {
                return previousResult;
              }
              const prevExploreGroups = previousResult.searchGroup;
              const updatedGroup = previousResult.searchGroup.rows.concat(
                fetchMoreResult.searchGroup.rows,
              );

              return { searchGroup: { ...prevExploreGroups, ...{ rows: updatedGroup } } };
            },
          });
        }}
      />
    );
  }

  render() {
    const { searchGroups } = this.props;

    if (searchGroups.networkStatus === 1) {
      return <Loading />;
    }

    if (searchGroups.error) {
      return <Text>Error: {searchGroups.error.message}</Text>;
    }

    return this.renderSearchGroupList();
  }
}

SearchGroupResult.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  searchGroups: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    total: PropTypes.numeric,
    networkStatus: PropTypes.number,
    searchGroup: PropTypes.shape({
      rows: PropTypes.arrayOf(PropTypes.object),
      count: PropTypes.number,
    }),
  }).isRequired,
  keyword: PropTypes.string.isRequired,
};

export default SearchGroupResult;
