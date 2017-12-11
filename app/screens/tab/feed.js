import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import Filter from '@components/feed/filter';
import { Loading, Wrapper, FeedContainer } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import { withShare } from '@services/apollo/auth';
import PropTypes from 'prop-types';
import Share from '@components/common/share';
import { compose } from 'react-apollo';
import Colors from '@theme/colors';
import FeedIcon from '@icons/ic_feed.png';
import FeedIconActive from '@icons/ic_feed_active.png';
import Map from '@icons/icon_map.png';

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -75,
    left: -75,
    height: 300,
    width: 300,
    borderRadius: 160,
    backgroundColor: '#02cbf9',
  },
  mapWrapper: {
    height: 50,
    width: 50,
  },
  mapImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    padding: 16,
  },
  menuIcon: {
    marginLeft: 12,
  },
  hi: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.white,
    backgroundColor: 'transparent',
  },
});

class Feed extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => <Image source={focused ? FeedIconActive : FeedIcon} />,
  };

  constructor(props) {
    super(props);
    this.state = ({ refreshing: false, modalDetail: {}, modalType: '', isOpen: false, filterOpen: false });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { feeds, subscribeToFeed } = this.props;

    if (params && typeof params.refetch !== 'undefined') {
      feeds.refetch();
    }

    subscribeToFeed();
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

  setFilterVisibility = (visibility) => {
    this.setState({ filterOpen: visibility });
  }

  redirectToMap = () => {
    this.props.navigation.navigate('Map');
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

  renderFooter = () => {
    const { loading, rows, error, count } = this.props.feeds;

    const refetch = (
      <TouchableOpacity onPress={this.onRefreshClicked}>
        <Text>Reload</Text>
      </TouchableOpacity>
    );

    if (error) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text>Error: {error.message}</Text>
          {refetch}
        </View>
      );
    }

    if (!rows || rows.length < 1) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text>No Feeds.</Text>
          {refetch}
        </View>
      );
    }

    if (rows.length >= count) {
      return (<View style={{ paddingVertical: 60 }} />);
    }

    if (!loading) return null;

    return (<View style={{ paddingVertical: 60 }}><Loading /></View>);
  }

  renderHeader = () => (
    <View style={styles.menuBar}>
      {this.renderMap()}
      <Text style={styles.hi}>Hi!</Text>
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => this.setFilterVisibility(true)}
      >
        <Image source={require('@icons/ic_menu.png')} />
      </TouchableOpacity>
    </View>
  )

  renderFeed() {
    const { feeds } = this.props;

    if (feeds.networkStatus === 1) {
      return (
        <View style={{ marginTop: 100 }}>
          <Loading />
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
        refreshing={feeds.networkStatus === 4 || feeds.loading}
        onRefresh={() => feeds.refetch()}
        onEndReachedThreshold={0.8}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (feeds.loading || feeds.rows.length >= feeds.count) return;
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

  renderMap = () => (
    <View style={styles.mapWrapper} >
      <TouchableOpacity onPress={this.redirectToMap} style={styles.mapWrapper}>
        <Image source={Map} style={styles.mapImg} />
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <Wrapper bgColor="transparent" >
        <FeedContainer bgColor="transparent">
          <View style={styles.circle} />
          {this.renderFeed()}
        </FeedContainer>
        {this.renderShareModal()}
        <Filter
          onPress={() => { }}
          showModal={this.state.filterOpen}
          onCloseModal={() => this.setFilterVisibility(false)}
        />
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
    error: PropTypes.object,
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
  subscribeToFeed: PropTypes.func.isRequired,
};

export default compose(withShare, withFeed)(Feed);
