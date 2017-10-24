import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import { Loading, Wrapper, FeedContainer } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import Header from '@components/feed/header';
import TabIcon from '@components/tabIcon';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import Share from '@components/offer/share';

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
    this.state = ({ refreshing: false, isOpen: false });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { data } = this.props;

    if (params && typeof params.refetch !== 'undefined') {
      data.refetch();
    }
  }

  onPress = (type, datail) => {
    const { navigation } = this.props;
    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: datail });
    }

    if (type === 'offer') {
      navigation.navigate('OfferDetail', { offer: datail });
    }
  }

  onSharePress = () => {
    this.setState({ isOpen: true });
  };

  onShare = () => {
    this.setState({ isOpen: false });
  }

  renderModal() {
    return (
      <Modal position={'bottom'} swipeArea={50} isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })}>
        <ScrollView>
          <Share modal onNext={this.onShare} />
        </ScrollView>
      </Modal>
    );
  }

  renderFooter = () => {
    const { data } = this.props;
    if (!data.loading) return null;

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
  }

  renderFeed() {
    const { data } = this.props;
    if (data.networkStatus === 1) {
      return <Loading />;
    }

    if (data.error) {
      return <Text>Error: {data.error.message}</Text>;
    }

    if (!data.getFeed || data.getFeed.length < 1) {
      return <View><Text>No Feeds.</Text></View>;
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
        onEndReachedThreshold={2}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (data.loading) return;
          data.fetchMore({
            variables: { offset: data.getFeed.length + 1, limit: 5 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.getFeed.length === 0) {
                return previousResult;
              }
              return {
                getFeed: previousResult.getFeed.concat(fetchMoreResult.getFeed),
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
          <Header />
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
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        refetch: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
};

export default withFeed(Feed);
