import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import { Loading, Wrapper, FeedContainer } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import { withShare } from '@services/apollo/auth';
import Header from '@components/feed/header';
import TabIcon from '@components/tabIcon';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import Share from '@components/common/share';
import { compose } from 'react-apollo';

class Feed extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-home-outline"
        iconFocused="ios-home"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = ({ refreshing: false, modalDetail: {}, modalType: '', isOpen: false });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { feeds } = this.props;

    if (params && typeof params.refetch !== 'undefined') {
      feeds.refetch();
    }
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

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.error);
  };

  onRefreshClicked = () => {
    this.props.feeds.refetch();
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  redirectToMap = () => {
    this.props.navigation.navigateWithDebounce('Map');
  };

  redirectToGroup = () => {
    this.props.navigation.navigateWithDebounce('ExploreGroup');
  }

  renderModal() {
    return (
      <Modal position={'bottom'} swipeArea={50} isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })}>
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

  renderFooter = () => {
    const { loading, rows, count } = this.props.feeds;

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
        style={{
          paddingVertical: 60,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <Loading />
      </View>
    );
  };

  renderFeed() {
    const { feeds } = this.props;

    if (feeds.networkStatus === 1) {
      return <Loading />;
    }

    const refetch = (
      <TouchableOpacity onPress={this.onRefreshClicked}>
        <Text>Reload</Text>
      </TouchableOpacity>
    );

    if (feeds.error) {
      return (
        <View>
          <Text>Error: {feeds.error.message}</Text>
          {refetch}
        </View>
      );
    }

    if (!feeds.rows || feeds.rows.length < 1) {
      return (
        <View>
          <Text>No Feeds.</Text>
          {refetch}
        </View>
      );
    }

    return (
      <FlatList
        data={feeds.rows}
        renderItem={
          ({ item }) => (<FeedItem
            onSharePress={this.onSharePress}
            onPress={this.onPress}
            key={item.id}
            feed={item}
          />)
        }
        keyExtractor={(item, index) => index}
        refreshing={feeds.networkStatus === 4}
        onRefresh={() => feeds.refetch()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (feeds.loading) return;
          feeds.fetchMore({
            variables: { offset: feeds.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.getFeed.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.getFeed.rows.concat(fetchMoreResult.getFeed.rows);

              return { getFeed: { ...previousResult.getFeed, ...{ rows } } };
            },
          });
        }}
      />
    );
  }

  render() {
    return (
      <Wrapper bgColor="#00aeef" >
        <FeedContainer bgColor="#dddee3">
          <Header onPressGroup={this.redirectToGroup} onPressMap={this.redirectToMap} />
          {this.renderFeed()}
        </FeedContainer>
        {this.renderModal()}
      </Wrapper>
    );
  }
}

Feed.propTypes = {
  share: PropTypes.func.isRequired,
  feeds: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    fetchMore: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    count: PropTypes.numeric,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    navigateWithDebounce: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        refetch: PropTypes.bool,
      }),
    }).isRequired,
  }).isRequired,
};

export default compose(withShare, withFeed)(Feed);
