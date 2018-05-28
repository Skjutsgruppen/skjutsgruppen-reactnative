import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Modal, Alert, Platform, PermissionsAndroid, BackHandler } from 'react-native';
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
import TouchableHighlight from '@components/touchableHighlight';
import CoCreateModal from '@components/coCreateModal';
import AppText from '@components/utils/texts/appText';
import Button from '@components/experience/button';
import AndroidOpenSettings from 'react-native-android-open-settings';

const FeedExperience = withGetExperiences(List);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  menuWrapper: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 27,
    marginTop: 22,
    marginBottom: 4,
  },
  mapWrapper: {
    alignSelf: 'flex-end',
  },
  mapImg: {
    resizeMode: 'contain',
  },
  menuIconWrapper: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 3,
  },
  menuIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  permissionModal: {
    marginVertical: 20,
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 20,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
    marginHorizontal: 45,
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
      showCoCreateModal: true,
      contactPermission: true,
      contactPermissionResponse: null,
    });

    this.feedList = null;
  }

  async componentWillMount() {
    const { feeds, subscribeToFeed, navigation } = this.props;
    const { params } = navigation.state;

    navigation.setParams({ scrollToTop: this.scrollToTop });

    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));

    try {
      if (Platform === 'android' || Platform.OS === 'android') {
        const permissions =
          await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

        this.setState({ contactPermission: permissions });

        if (!permissions) {
          const response =
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

          this.setState({ contactPermission: !(response === 'denied' || response === 'never_ask_again'), contactPermissionResponse: response });
        }
      }
    } catch (err) {
      console.warn(err);
    }

    if (params && typeof params.refetch !== 'undefined') {
      feeds.refetch();
    }
    this.currentLocation();
    subscribeToFeed();
  }

  onPress = (type, details) => {
    const { navigation } = this.props;
    const { id } = details;

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { id });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { id });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: id });
    }

    if (type === FEEDABLE_NEWS) {
      navigation.navigate('NewsDetail', { news: details });
    }

    if (type === FEEDABLE_EXPERIENCE) {
      navigation.navigate('ExperienceDetail', { id });
    }
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

  askForPermission = async () => {
    try {
      if (Platform === 'android' || Platform.OS === 'android') {
        const response =
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

        if (response === 'granted') {
          this.setState({ contactPermission: true });
          return;
        }

        if (this.state.contactPermissionResponse === 'never_ask_again') {
          AndroidOpenSettings.appDetailsSettings();
          return;
        }

        this.setState({ contactPermission: !(response === 'denied' || response === 'never_ask_again'), contactPermissionResponse: response });
      }
    } catch (e) {
      console.warn(e);
    }
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

  renderHeader = () => {
    const hiStyle = Platform.OS === 'ios' ? { marginTop: 8 } : {};
    return (<View style={styles.header}>
      <View style={styles.menuWrapper}>
        <Heading
          fontVariation="bold"
          size={24}
          color={Colors.text.white}
          style={[{ lineHeight: 24 }, hiStyle]}
        >
          {trans('feed.hi')}!
        </Heading>
        <View style={styles.menuIconWrapper}>
          <TouchableHighlight
            style={styles.menuIcon}
            onPress={() => this.setFilterVisibility(true)}
          >
            <Image source={require('@assets/icons/ic_menu.png')} />
          </TouchableHighlight>
        </View>
      </View>
      {this.renderMap()}
    </View>);
  }

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
            title={trans('feed.experiences')}
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
    const { filterType } = this.state;
    let noResultText = trans('feed.no_rides_have_been_created_yet');

    if (filterType === FEEDABLE_EXPERIENCE.toLowerCase()) {
      noResultText = trans('feed.no_experiences_published_yet');
    }

    if (filterType === FEEDABLE_TRIP) {
      noResultText = trans('feed.no_rides_yet');
    }

    if (filterType === FEEDABLE_NEWS.toLowerCase()) {
      noResultText = trans('feed.no_news_yet');
    }

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
        shouldUpdateAnimatedValue
        noResultText={noResultText}
      />
    );
  }

  renderMap = () => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('Map')} style={styles.mapWrapper}>
      <Image source={Map} style={styles.mapImg} />
    </TouchableOpacity>
  );

  renderCoCreateModal = () => {
    const { showCoCreateModal } = this.state;

    return (<CoCreateModal
      visible={showCoCreateModal}
      toggleCoCreateModalVisibility={(value) => { this.setState({ showCoCreateModal: value }); }}
    />);
  }

  renderContactPermission = () => {
    if (Platform === 'android' || Platform.OS === 'android') {
      return (
        <Modal
          transparent
          visible={!this.state.contactPermission}
          onRequestClose={() => { }}
        >
          <View style={styles.backdrop}>
            <View style={styles.permissionModal}>
              <AppText
                fontVariation="semibold"
                size={16}
                centered
                style={{ marginBottom: 24, paddingVertical: 10, paddingHorizontal: 20 }}
              >
                {trans('global.well_thats_sad')}
              </AppText>
              <Button
                style={{ padding: 20, width: 250, alignSelf: 'center', marginBottom: 20 }}
                onPress={() => BackHandler.exitApp()}
                label={trans('global.no_thanks_close_this_app')}

              />
              <Button
                style={{ padding: 20, width: 250, alignSelf: 'center' }}
                onPress={() => this.askForPermission()}
                label={trans('global.open_permission_settings')}
              />
            </View>
          </View>
        </Modal>
      );
    }

    return null;
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <Circle animatable />
        {this.renderFeed()}
        {this.renderShareModal()}
        <Filter
          selected={this.state.filterType}
          onPress={this.onFilterChange}
          showModal={this.state.filterOpen}
          onCloseModal={() => this.setFilterVisibility(false)}
        />
        {this.renderCoCreateModal()}
        {this.renderContactPermission()}
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
