import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FeedItem from '@components/feed/feedItem';
import Filter from '@components/feed/filter';
import { Wrapper } from '@components/common';
import { withFeed } from '@services/apollo/trip';
import { withShare } from '@services/apollo/share';
import PropTypes from 'prop-types';
import Share from '@components/common/share';
import { compose } from 'react-apollo';
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
  EXPERIENCE_AFTER_CARDS,
  EXPERIENCE_FETCH_LIMIT,
  FEEDABLE_PROFILE,
  FEEDABLE_NEWS,
  FEEDABLE_EXPERIENCE,
  FEED_FILTER_NEARBY,
} from '@config/constant';
import { withGetExperiences } from '@services/apollo/experience';
import List from '@components/experience/list';
import DataList from '@components/dataList';
import { Gradients } from '@theme';

const FeedExperience = withGetExperiences(List);

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: -Dimensions.get('window').width * 0.1,
    left: -Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.6,
    width: Dimensions.get('window').width * 0.6,
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
      latitude: '',
      longitude: '',
      locationError: false,
      currentLocation: false,
      totalExperiences: 0,
    });
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { feeds, subscribeToFeed, screenProps } = this.props;
    const { filterType } = screenProps.feed;
    this.setState({ filterType });

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
      navigation.navigate('ExperienceScreen', { experience: detail });
    }
  };

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType, share })
      .then(() => this.setState({ isOpen: false }))
      .catch((console.warn));
  };

  onRefreshClicked = () => {
    this.props.feeds.refetch();
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

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

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.menuWrapper}>
        <Text style={styles.hi}>{trans('feed.hi')}!</Text>
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

    return (
      <DataList
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
      />);
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
        <LinearGradient colors={Gradients.blue} style={styles.circle} />
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
  screenProps: PropTypes.shape({
    feed: PropTypes.shape({
      filterType: PropTypes.string,
    }),
  }).isRequired,
};

export default compose(withShare, withFeed)(Feed);
