import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import FeedItem from '@components/feed/feedItem';
import Filter from '@components/feed/filter';
import { Wrapper, Circle } from '@components/common';
import { Heading } from '@components/utils/texts';
import { withFeed } from '@services/apollo/trip';
import PropTypes from 'prop-types';
import Share from '@components/common/share';
import Colors from '@theme/colors';
import FeedIcon from '@assets/icons/ic_feed.png';
import FeedIconActive from '@assets/icons/ic_feed_active.png';
import Map from '@assets/map_toggle.png';
import { getCountryLocation, getCurrentLocation } from '@helpers/device';
import { trans } from '@lang/i18n';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  FEED_FILTER_EVERYTHING,
  EXPERIENCE_FIRST_CARDS,
  EXPERIENCE_REPEAT_CARDS,
  EXPERIENCE_FETCH_LIMIT,
  FEEDABLE_PROFILE,
  FEEDABLE_NEWS,
  FEEDABLE_EXPERIENCE,
  FEED_FILTER_NEARBY,
} from '@config/constant';
import { withGetExperiences } from '@services/apollo/experience';
import List from '@components/experience/list';
import DataList from '@components/dataList';

const FeedExperience = withGetExperiences(List);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 12,
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
});

class Feed extends Component {
  static navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => <Image source={focused ? FeedIconActive : FeedIcon} />,
    tabBarOnPress: ({ scene, jumpToIndex }) => {
      if (scene.focused) {
        const navigationInRoute = scene.route;
        if (!!navigationInRoute
          && !!navigationInRoute.params
          && !!navigationInRoute.params.scrollToTop) {
          navigationInRoute.params.scrollToTop();
        }
      }
      jumpToIndex(0);
    },
  };

  constructor(props) {
    super(props);
    this.state = ({
      refreshing: false,
      shareable: {},
      shareableType: '',
      showShareModal: false,
      filterOpen: false,
      filterType: FEED_FILTER_EVERYTHING,
      latitude: '',
      longitude: '',
      locationError: false,
      currentLocation: false,
      totalExperiences: 0,
      loading: false,
    });

    this.feedList = null;
  }

  componentWillMount() {
    const { feeds, subscribeToFeed, navigation } = this.props;
    const { params } = navigation.state;

    navigation.setParams({ scrollToTop: this.scrollToTop });

    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));

    if (params && typeof params.refetch !== 'undefined') {
      feeds.refetch();
    }
    this.currentLocation();
    subscribeToFeed();
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;
    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: detail });
    }

    if (type === FEEDABLE_NEWS) {
      navigation.navigate('NewsDetail', { news: detail });
    }

    if (type === FEEDABLE_EXPERIENCE) {
      navigation.navigate('ExperienceDetail', { experience: detail });
    }
  };

  onFilterChange = (type) => {
    const { filterType, longitude, latitude } = this.state;
    if (type === FEED_FILTER_NEARBY && (longitude === '' || latitude === '')) {
      this.currentLocation();
      Alert.alert('Location Error', 'Could not find your location. Please enable location service or try again.');
      this.setFilterVisibility(false);
    } else if (type !== filterType) {
      this.setState({ filterType: type }, () => {
        const from = (longitude && longitude) ? [longitude, latitude] : [];
        this.props.feeds.refetch({ offset: 0, filter: { type, from } });
      });
      this.setFilterVisibility(false);
    }
  }

  setFilterVisibility = (visibility) => {
    this.setState({ filterOpen: visibility });
  }

  tabEvent = (e, type) => {
    if (this.feedList && type === 'didBlur') {
      if (this.state.filterType === FEED_FILTER_EVERYTHING) {
        this.feedList.getNode().scrollToOffset({ offset: 0, animated: true });
      } else {
        this.setState({ filterType: FEED_FILTER_EVERYTHING }, () => {
          this.props.feeds.refetch({ offset: 0, filter: { type: FEED_FILTER_EVERYTHING } });
          this.feedList.getNode().scrollToOffset({ offset: 0, animated: true });
        });
      }
    }
  }

  scrollToTop = () => {
    if (this.feedList) {
      this.props.feeds.refetch();
      this.feedList.getNode().scrollToOffset({ offset: 0, animated: true });
    }
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

  experienceAfterCards = (index) => {
    if (this.isFirstLimitCard(index)) {
      return EXPERIENCE_FIRST_CARDS;
    }

    return EXPERIENCE_REPEAT_CARDS;
  }

  isFirstLimitCard = index => index < EXPERIENCE_FIRST_CARDS;

  renderShareModal() {
    const { showShareModal, shareableType, shareable } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={shareableType}
          detail={shareable}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.menuWrapper}>
        <Heading
          fontVariation="bold"
          size={24}
          color={Colors.text.white}
        >
          {trans('feed.hi')}!
        </Heading>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => this.setFilterVisibility(true)}
        >
          <Image source={require('@assets/icons/ic_menu.png')} />
        </TouchableOpacity>
      </View>
      {this.renderMap()}
    </View>
  )

  renderExperience = (index) => {
    const { totalExperiences } = this.props.feeds;

    let indexPlusOne = index + 1;
    let deductor = 1;

    if (!this.isFirstLimitCard(index)) {
      indexPlusOne -= EXPERIENCE_FIRST_CARDS;
      deductor = 0;
    }

    const isRenderable = (indexPlusOne % this.experienceAfterCards(index) === 0);
    const offset = (indexPlusOne / this.experienceAfterCards(index)) - deductor;
    const isLimitNotExceeded = totalExperiences > offset;
    const isEverythingFilter = this.state.filterType === FEED_FILTER_EVERYTHING;

    if (isLimitNotExceeded && isRenderable && isEverythingFilter) {
      return (
        <View>
          <FeedExperience
            title="Experiences"
            offset={offset * EXPERIENCE_FETCH_LIMIT}
            limit={EXPERIENCE_FETCH_LIMIT}
          />
        </View>
      );
    }

    return null;
  }

  renderItem = ({ item, index }) => (
    <View>
      <FeedItem
        onSharePress={(shareableType, shareable) =>
          this.setState({ showShareModal: true, shareableType, shareable })}
        onPress={this.onPress}
        feed={item}
      />
      {this.renderExperience(index)}
    </View>
  );

  renderFeed() {
    const { feeds } = this.props;

    return (
      <DataList
        innerRef={(list) => { this.feedList = list; }}
        data={feeds}
        header={this.renderHeader}
        renderItem={this.renderItem}
        fetchMoreOptions={{
          variables: { offset: this.props.feeds.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.getFeed.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.getFeed.rows.concat(fetchMoreResult.getFeed.rows);

            return { getFeed: { ...previousResult.getFeed, ...{ rows } } };
          },
        }}
      />
    );
  }

  renderMap = () => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('Map')} style={styles.mapWrapper}>
      <Image source={Map} style={styles.mapImg} />
    </TouchableOpacity>
  );

  render() {
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <Circle />
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

export default withFeed(Feed);
