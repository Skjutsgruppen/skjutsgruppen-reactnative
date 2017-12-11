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
    const { loading, rows, count } = this.props.searchGroup;

    if (!loading) return null;

    if (rows.length >= count) {
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
    const { searchGroup, keyword } = this.props;
    const { rows, count, networkStatus, refetch, loading, fetchMore } = searchGroup;

    return (
      <FlatList
        data={rows}
        renderItem={({ item }) => (<GroupItem
          min
          onPress={this.redirect}
          key={item.id}
          group={item}
        />)}
        keyExtractor={(item, index) => index}
        refreshing={networkStatus === 4}
        onRefresh={() => refetch()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (loading || rows.length >= count) return;

          fetchMore({
            variables: { keyword, offset: rows.length },
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
    const { error, networkStatus } = this.props.searchGroup;

    if (networkStatus === 1) {
      return <Loading />;
    }

    if (error) {
      return <Text>Error: {error.message}</Text>;
    }

    return this.renderSearchGroupList();
  }
}

SearchGroupResult.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  searchGroup: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
  }).isRequired,
  keyword: PropTypes.string.isRequired,
};

export default SearchGroupResult;
