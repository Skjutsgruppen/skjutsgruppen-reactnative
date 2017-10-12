import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import { Loading, Container } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import Header from '@components/feed/header';
import TabIcon from '@components/tabIcon';

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
    this.state = ({ refreshing: false });
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
        renderItem={({ item }) => <FeedItem onPress={this.onPress} key={item.id} feed={item} />}
        keyExtractor={(item, index) => index}
        refreshing={data.networkStatus === 4}
        onRefresh={() => data.refetch()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (data.loading) return;
          data.fetchMore({
            variables: { offset: data.getFeed.length + 1, limit: 5 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              // Don't do anything if there weren't any new items
              if (!fetchMoreResult || fetchMoreResult.getFeed.length === 0) {
                return previousResult;
              }
              return {
                // Append the new getFeed results to the old one
                getFeed: previousResult.getFeed.concat(fetchMoreResult.getFeed),
              };
            },
          });
        }}
      />);
  }

  render() {
    return (
      <View style={{ backgroundColor: '#00aeef', flex: 1 }}>
        <Container bgColor="#dddee3">
          <Header />
          {this.renderFeed()}
        </Container>
      </View>
    );
  }
}

export default withFeed(Feed);
