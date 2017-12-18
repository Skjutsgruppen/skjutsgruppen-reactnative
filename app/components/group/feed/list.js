import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import Item from '@components/group/feed/item';

const styles = StyleSheet.create({
  infoText: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    color: Colors.text.gray,
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

class GroupFeed extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, isOpen: false });
  }

  componentWillMount() {
    const { subscribeToGroupFeed, groupId } = this.props;

    subscribeToGroupFeed({ groupId });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;
    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === 'offer') {
      navigation.navigate('OfferDetail', { offer: detail });
    }

    if (type === 'ask') {
      navigation.navigate('AskDetail', { ask: detail });
    }

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }
  };

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  };

  renderFooter = () => {
    const { loading, rows, count } = this.props.groupFeed;

    if (rows && rows.length < 1) {
      return (
        <Text style={styles.infoText}>No feeds</Text>
      );
    }

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

    if (!loading) return null;

    return (
      <View
        style={styles.loadingWrapper}
      >
        <Loading />
      </View>
    );
  };

  render() {
    const { rows, error, count, networkStatus, refetch, loading, fetchMore } = this.props.groupFeed;

    if (networkStatus === 1) {
      return (
        <View
          style={styles.loadingWrapper}
        >
          <Loading />
        </View>
      );
    }

    if (error) {
      return (
        <Text style={styles.infoText}>{error}</Text>
      );
    }

    return (
      <FlatList
        data={rows}
        renderItem={({ item }) => (<Item
          onPress={this.onPress}
          onSharePress={this.onSharePress}
          groupFeed={item}
        />)}
        keyExtractor={(item, index) => index}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={this.props.header}
        ListFooterComponent={this.renderFooter}
        style={{ backgroundColor: Colors.background.lightGray }}
        onEndReached={() => {
          if (loading || rows.length >= count) return;

          fetchMore({
            variables: { offset: rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.groupFeed.rows.length === 0) {
                return previousResult;
              }

              const newRows = previousResult.groupFeed.rows.concat(fetchMoreResult.groupFeed.rows);
              return { groupFeed: { ...previousResult.groupFeed, ...{ rows: newRows } } };
            },
          });
        }}
      />
    );
  }
}

GroupFeed.propTypes = {
  groupId: PropTypes.number.isRequired,
  groupFeed: PropTypes.shape({
    loading: PropTypes.boolean,
    error: PropTypes.object,
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    networkStatus: PropTypes.number,
    refetch: PropTypes.func,
    fetchMore: PropTypes.fetchMore,
  }).isRequired,
  header: PropTypes.element.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  subscribeToGroupFeed: PropTypes.func.isRequired,
};

export default GroupFeed;
