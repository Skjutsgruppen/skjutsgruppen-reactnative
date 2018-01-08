import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Loading } from '@components/common';
import PropTypes from 'prop-types';
import { withNotificationSearch } from '@services/apollo/notification';
import MesssageItem from '@components/message/item';

class SearchList extends PureComponent {
  renderHeader = () => {
    const { error, count, refetch, networkStatus } = this.props.searchMessages;
    if (networkStatus === 1) {
      return (
        <View style={{ marginTop: 20 }}>
          <Loading />
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text>Error: {error.message}</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text>Reload</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (count < 1) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text>No Search Result.</Text>
        </View>
      );
    }

    return null;
  }

  renderFooter = () => {
    const { loading, rows, count } = this.props.searchMessages;

    if (rows.length >= count) {
      return (<View style={{ paddingVertical: 60 }} />);
    }

    if (!loading) return null;

    return (<View style={{ paddingVertical: 60 }}><Loading /></View>);
  }

  render() {
    const { searchMessages, navigation } = this.props;

    return (<FlatList
      data={searchMessages.rows}
      renderItem={
        ({ item }) => (<MesssageItem
          navigation={navigation}
          filters={'filters'}
          notification={item}
          key={item.id}
        />)
      }
      keyExtractor={(item, index) => index}
      refreshing={searchMessages.networkStatus === 4 || searchMessages.networkStatus === 2}
      onRefresh={() => searchMessages.refetch()}
      onEndReachedThreshold={0.8}
      ListHeaderComponent={this.renderHeader}
      ListFooterComponent={this.renderFooter}
      onEndReached={() => {
        if (searchMessages.loading || searchMessages.rows.length >= searchMessages.count) return;
        searchMessages.fetchMore({
          variables: { offset: searchMessages.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.searchMessages.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.searchMessages.rows.concat(
              fetchMoreResult.searchMessages.rows,
            );

            return { searchMessages: { ...previousResult.searchMessages, ...{ rows } } };
          },
        });
      }}
    />);
  }
}

SearchList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
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
