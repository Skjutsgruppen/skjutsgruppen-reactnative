import React, { Component } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import Item from '@components/new/group/feed/item';
import { compose } from 'react-apollo';
import { withShare } from '@services/apollo/auth';
import Share from '@components/common/share';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED, FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
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
    this.state = ({ loading: false, modalDetail: {}, modalType: '', isOpen: false });
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

    if (type === FEED_TYPE_OFFER) {
      navigation.navigate('OfferDetail', { offer: detail });
    }

    if (type === FEED_TYPE_WANTED) {
      navigation.navigate('AskDetail', { ask: detail });
    }

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }
  };

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  };

  onShare = (share) => {
    const { modalDetail, modalType } = this.state;

    this.props.share({ id: modalDetail.id, type: modalType === 'group' ? FEEDABLE_GROUP : FEEDABLE_TRIP, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

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
            borderColor: 'transparent',
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

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup={this.state.modalType !== 'group'}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

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
      <View style={styles.wrapper} >
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
          onEndReached={() => {
            if (loading || rows.length >= count) return;

            fetchMore({
              variables: { offset: rows.length },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.groupFeed.rows.length === 0) {
                  return previousResult;
                }

                const newRows = previousResult.groupFeed.rows.concat(
                  fetchMoreResult.groupFeed.rows,
                );
                return {
                  groupFeed: {
                    ...previousResult.groupFeed,
                    ...{ rows: newRows },
                  },
                };
              },
            });
          }}
        />
        {this.renderShareModal()}
      </View>
    );
  }
}

GroupFeed.propTypes = {
  share: PropTypes.func.isRequired,
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

export default compose(withShare)(GroupFeed);
