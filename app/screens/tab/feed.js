import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import Filter from '@components/feed/filter';
import { Loading, Wrapper } from '@components/common';
import { withFeed } from '@services/apollo/feed';
import { withShare } from '@services/apollo/auth';
import PropTypes from 'prop-types';
import Share from '@components/common/share';
import { compose } from 'react-apollo';
import Colors from '@theme/colors';
import FeedIcon from '@icons/ic_feed.png';
import FeedIconActive from '@icons/ic_feed_active.png';
import Map from '@assets/map_toggle.png';
import { getCountryLocation, getCurrentLocation } from '@helpers/device';
import { trans } from '@lang/i18n';
import { FEED_FILTER_EVERYTHING, EXPERIENCE_AFTER_CARDS, EXPERIENCE_FETCH_LIMIT } from '@config/constant';
import { withGetExperiences } from '@services/apollo/experience';
import List from '@components/experience/list';

const FeedExperience = withGetExperiences(List);

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -75,
    left: -75,
    height: 280,
    width: 280,
    borderRadius: 160,
    backgroundColor: '#02cbf9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 24,
  },
  mapWrapper: {
    alignSelf: 'flex-end',
  },
  mapImg: {
    resizeMode: 'contain',
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
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
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
    this.state = ({
      refreshing: false,
      modalDetail: {},
      modalType: '',
      isOpen: false,
      filterOpen: false,
      filterType: FEED_FILTER_EVERYTHING,
      coordinates: [],
      totalExperiences: 0,
    });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { feeds, subscribeToFeed } = this.props;

    if (params && typeof params.refetch !== 'undefined') {
      feeds.refetch();
    }
    this.currentLocation();
    subscribeToFeed();
  }

  onExperiencePress = () => {
    this.props.navigation.navigate('ExperienceDetail');
  };

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

    if (type === 'news') {
      navigation.navigate('NewsDetail', { news: detail });
    }

    if (type === 'experience') {
      navigation.navigate('ExperienceDetail', { experience: detail });
    }
  };

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onRefreshClicked = () => {
    this.props.feeds.refetch();
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onFilterChange = (type) => {
    const { filterType, coordinates } = this.state;
    if (type !== filterType) {
      this.setState({ filterType: type }, () => {
        this.props.feeds.refetch({ offset: 0, filter: { type, from: coordinates } });
      });
      this.setFilterVisibility(false);
    }
  }

  setFilterVisibility = (visibility) => {
    this.setState({ filterOpen: visibility });
  }

  async currentLocation() {
    if (this.state.currentLocation) return;

    try {
      const res = await getCurrentLocation();
      this.setState({
        latitude: res.latitude,
        longitude: res.longitude,
        currentLocation: true,
        locationError: false,
      });
    } catch (error) {
      const { latitude, longitude } = getCountryLocation();
      if (latitude) {
        this.setState({ latitude, longitude, currentLocation: false, locationError: false });
      } else {
        this.setState({ locationError: true });
      }
    }
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
        <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
      </TouchableOpacity>
    );

    if (error && !loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          {refetch}
        </View>
      );
    }

    if (count < 1 && !loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text style={styles.errorText}>No Feeds</Text>
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
    <View style={styles.header}>
      <View style={styles.menuWrapper}>
        <Text style={styles.hi}>{trans('feed.hi')}!</Text>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => this.setFilterVisibility(true)}
        >
          <Image source={require('@icons/ic_menu.png')} />
        </TouchableOpacity>
      </View>
      {this.renderMap()}
    </View>
  )

  renderExperience = (index) => {
    const { totalExperiences } = this.props.feeds;
    const indexPlusOne = index + 1;
    const isRenderable = (indexPlusOne % EXPERIENCE_AFTER_CARDS === 0);
    const offset = ((indexPlusOne / EXPERIENCE_AFTER_CARDS) - 1) * EXPERIENCE_FETCH_LIMIT;
    const isLimitNotExceeded = totalExperiences > offset;
    const isEverythingFilter = this.state.filterType === FEED_FILTER_EVERYTHING;

    if (isLimitNotExceeded && isRenderable && isEverythingFilter) {
      return (
        <FeedExperience
          title="Experiences"
          offset={offset}
          limit={EXPERIENCE_FETCH_LIMIT}
        />);
    }

    return null;
  }

  renderItem = ({ item, index }) => (
    <View>
      <FeedItem
        onSharePress={this.onSharePress}
        onPress={this.onPress}
        feed={item}
      />
      {this.renderExperience(index)}
    </View>
  );

  renderFeed() {
    const { feeds } = this.props;

    if (feeds.networkStatus === 1 && feeds.rows.length < 1) {
      return (
        <View style={{ marginTop: 100 }}>
          <Loading />
        </View>
      );
    }

    return (
      <FlatList
        data={feeds.rows}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        refreshing={feeds.networkStatus === 4 || feeds.networkStatus === 2}
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
      <Wrapper bgColor="#eee" >
        <View style={styles.circle} />
        {this.renderFeed()}
        {this.renderShareModal()}
        <Filter
          selected={this.state.filterType}
          onPress={this.onFilterChange}
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
    totalExperiences: PropTypes.numeric,
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
