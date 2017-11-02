import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import { Loading, Wrapper, FeedContainer } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import Header from '@components/feed/header';
import TabIcon from '@components/tabIcon';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import Share from '@components/common/share';

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
    this.state = ({ refreshing: false, isGroup: true, isOpen: false });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { data } = this.props;

    if (params && typeof params.refetch !== 'undefined') {
      data.refetch();
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
  };

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== 'group' });
  };

  onShare = () => {
    this.setState({ isOpen: false });
  };

  onRefreshClicked = () => {
    this.props.data.refetch();
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  redirectToMap = () => { };

  redirectToGroup = () => {
    this.props.navigation.navigateWithDebounce('ExploreGroup');
  }

  renderModal() {
    return (
      <Modal position={'bottom'} swipeArea={50} isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })}>
        <ScrollView>
          <Share
            modal
            showGroup={this.state.isGroup}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  renderFooter = () => {
    const { loading, getFeed, total } = this.props.data;

    if (getFeed.length >= total) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        >
          <Text>No more feed</Text>
        </View>
      );
    }

    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <Loading />
      </View>
    );
  };

  renderFeed() {
    const { data } = this.props;

    if (data.networkStatus === 1) {
      return <Loading />;
    }

    const refetch = (
      <TouchableOpacity onPress={this.onRefreshClicked}>
        <Text>Reload</Text>
      </TouchableOpacity>
    );

    if (data.error) {
      return (
        <View>
          <Text>Error: {data.error.message}</Text>
          {refetch}
        </View>
      );
    }

    if (!data.getFeed || data.getFeed.length < 1) {
      return (
        <View>
          <Text>No Feeds.</Text>
          {refetch}
        </View>
      );
    }

    return (
      <FlatList
        data={data.getFeed}
        renderItem={
          ({ item }) => (<FeedItem
            onSharePress={this.onSharePress}
            onPress={this.onPress}
            key={item.id}
            feed={item}
          />)
        }
        keyExtractor={(item, index) => index}
        refreshing={data.networkStatus === 4}
        onRefresh={() => data.refetch()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (data.loading) return;
          data.fetchMore({
            variables: { offset: data.getFeed.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.getFeed.length === 0) {
                return previousResult;
              }

              const prevFeed = previousResult.getFeed;

              const Feeds = previousResult.getFeed.Feed.concat(fetchMoreResult.getFeed.Feed);

              return {
                getFeed: { ...prevFeed, ...{ Feed: Feeds } },
              };
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
  data: PropTypes.shape({
    getFeed: PropTypes.arrayOf(PropTypes.object),
    fetchMore: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    total: PropTypes.numeric,
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

export default withFeed(Feed);
