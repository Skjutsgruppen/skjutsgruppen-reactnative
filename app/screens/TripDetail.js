import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Modal, Keyboard, BackHandler, Dimensions, Platform } from 'react-native';
import { compose } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import { submitComment } from '@services/apollo/comment';
import { withShare } from '@services/apollo/share';
import { withTrip, withTripFeed, withDeleteTrip } from '@services/apollo/trip';
import {
  AppNotification,
  DetailHeader,
  Loading,
  ShareButton,
  ActionModal,
  ModalAction,
  ConfirmModal,
  DeletedModal,
  Avatar,
} from '@components/common';
import { getToast } from '@config/toast';
import { Calendar } from 'react-native-calendars';
import { trans } from '@lang/i18n';
import FOF from '@components/relation/friendsOfFriend';
import MakeExperience from '@components/experience/make';
import PropTypes from 'prop-types';
import { Colors, Gradients } from '@theme';
import Share from '@components/common/share';
import Date from '@components/date';
import Toast from '@components/toast';
import ReturnRides from '@components/offer/returnRides';
import About from '@components/common/about';
import { getDate, UcFirst } from '@config';
import { FLEXIBILITY_EARLIER_TYPE, FEED_FILTER_OFFERED, FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED, EXPERIENCE_STATUS_PENDING, EXPERIENCE_STATUS_CAN_CREATE } from '@config/constant';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';
import { connect } from 'react-redux';
import { withSearch } from '@services/apollo/search';
import { AppText, Heading } from '@components/utils/texts';
import SuggestedRidesList from '@components/ask/suggestedRidesList';
import AskCommentBox from '@components/ask/commentBox';
import OfferCommentBox from '@components/offer/commentBox';
import ToolBar from '@components/utils/toolbar';
import Feed from '@components/feed/list';
import { Wrapper } from '@components/common/index';
import { withMute, withUnmute } from '@services/apollo/mute';
import Scheduler from '@services/firebase/scheduler';
import GeoLocation from '@services/location/geoLocation';

import ReturnIconPink from '@assets/icons/ic_return.png';
import ReturnIconBlue from '@assets/icons/ic_return_blue.png';
import CalendarIcon from '@assets/icons/ic_calender.png';
import { getTripDetails } from '@services/apollo/dataSync';
import LocationIcon from '@assets/icons/ic_location.png';

const SuggestedRides = withSearch(SuggestedRidesList);
const TripFeed = withTripFeed(Feed);

const styles = StyleSheet.create({
  bold: {
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  section: {
    padding: 24,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgWrapper: {
    height: 224,
    backgroundColor: '#e0e0e0',
  },
  feedImage: {
    height: 224,
    width: '100%',
  },
  profilePicWrapper: {
    position: 'absolute',
    top: 224 - (64 / 2),
    right: 20,
    zIndex: 20,
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.border.white,
    backgroundColor: Colors.background.lightGray,
  },
  profilePic: {
    height: '100%',
    width: '100%',
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
    marginRight: 4,
  },
  text: {
    marginVertical: 8,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  fromTo: {
    marginTop: 10,
    marginBottom: 2,
  },
  date: {
    marginBottom: 12,
  },
  tripDescription: {
    marginTop: 16,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  btnSection: {
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 12,
  },
  pillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    maxWidth: '45%',
    borderRadius: 24,
    paddingHorizontal: 24,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: -1 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  returnModalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: Dimensions.get('window').height * 0.7,
    backgroundColor: '#f6f9fc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  btnIcon: {
    marginRight: 16,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 12,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 16,
  },
  actionsWrapper: {
    marginTop: 'auto',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    transform: [
      { translateY: 1000 },
    ],
  },
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
  },
  dividerWrapper: {
    marginHorizontal: 24,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  closeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  closeModal: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  experienceWrapper: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  experienceIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    marginRight: 16,
  },
});

class TripDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      error: '',
      success: '',
      comment: '',
      showActionOption: false,
      writingComment: false,
      showShareModal: false,
      notification: false,
      notifierOffset: 0,
      showReturnRides: false,
      showRecurringRides: false,
      showSuggestedRides: false,
      trip: {},
      confirmModalVisibility: false,
      retry: false,
      deletedModal: false,
    });
  }

  componentWillMount() {
    const { navigation, subscribeToTrip } = this.props;

    navigation.setParams({
      right: () => <ShareButton onPress={() => this.setState({ showShareModal: true })} animated />,
    });

    const { notifier, notificationMessage, id } = navigation.state.params;
    const trip = getTripDetails(id);

    this.setState({ trip });
    subscribeToTrip(id);

    let initialState = { trip };
    if (notifier) {
      initialState = {
        ...initialState,
        ...{ notifier, notificationMessage, notification: true, notifierOffset: 75 },
      };
    }

    this.setState(initialState);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillReceiveProps({ trip, loading }) {
    if (!loading && trip && trip.isDeleted) {
      this.setState({ deletedModal: true });
    }

    if (!loading && trip.id) {
      if (trip.experienceStatus === EXPERIENCE_STATUS_PENDING) {
        const notifier = {
          firstName: '',
          avatar: ExperienceIcon,
          type: 'icon',
        };

        const notificationMessage = trans('detail.someone_has_already_created_an_experience');
        this.setState({
          trip,
          loading,
          notificationMessage,
          notifier,
          notification: true,
          notifierOffset: 75,
        });
      } else {
        this.setState({ trip, loading });
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation, nav } = this.props;

    if (nav && nav.routes.length <= 1) {
      navigation.replace('Tab');
    } else {
      navigation.goBack();
    }

    return true;
  }

  onSubmit = (comment, social) => {
    this.setState({ loading: true });
    const { submit } = this.props;
    const { trip } = this.state;
    const validation = this.checkValidation(comment);

    if (validation.pass()) {
      try {
        submit({ tripId: trip.id, text: comment, social }).then(() => {
          this.setState({ comment: '', loading: false, error: '' });
          Keyboard.dismiss();
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
      } catch (err) {
        this.setState({ loading: false, error: getToast(err) });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors) });
    }
  }

  onOffer = (comment) => {
    const { navigation } = this.props;
    const { trip } = this.state;
    this.setState({ comment });
    Keyboard.dismiss();

    navigation.navigate('Offer', { trip, isSuggestion: true, description: comment });
  }

  onProfilePress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { profileId: id });
  }

  onMapPress = (pressShareLocation = false) => {
    const { navigation } = this.props;
    const { trip } = this.state;
    navigation.navigate('Route', { info: trip, pressShareLocation });
    this.showActionModal(false);
  }

  onCloseNotification = () => {
    this.setState({ notification: false, notifierOffset: 0 });
  }

  onMute = (unit, type = null) => {
    const { trip } = this.state;
    const { mute, refetch } = this.props;
    const data = {
      mutable: 'Trip',
      mutableId: trip.id,
    };

    this.showActionModal(false);

    if (unit === 'forever') {
      data.forever = true;
    } else {
      const date = getDate();
      const from = date.format();
      const to = date.add(unit, type).format();
      data.from = from;
      data.to = to;
    }

    mute(data).then(async () => {
      if (unit === 'forever') {
        Scheduler.removeSpecificScheduledNotification(trip.id);
      } else {
        Scheduler.checkAndRemoveScheduledNotification(trip.id, data.to);
      }
    }).then(refetch);
  }

  onUnmute = () => {
    const { trip } = this.state;
    const { unmute, refetch } = this.props;

    this.showActionModal(false);
    unmute({
      mutable: 'Trip',
      mutableId: trip.id,
    }).then(async () => {
      Scheduler.schedule(trip);
    }).then(refetch);
  }

  onReport = () => {
    const { navigation } = this.props;
    const { trip } = this.state;
    this.showActionModal(false);
    navigation.navigate('Report', { data: { Trip: trip }, type: FEEDABLE_TRIP });
  }

  onDelete = () => {
    const { deleteTrip } = this.props;
    const { trip: { id } } = this.state;
    this.setState({ loading: true });

    deleteTrip({ id })
      .then(() => {
        this.setConfirmModalVisibility(false);
        this.setState({ loading: false, retry: false, deletedModal: true });
        this.navigateOnDelete();
        Scheduler.removeSpecificScheduledNotification(id);
        if (this.state.trip.Location && this.state.trip.Location.id) {
          GeoLocation.stopListeningToLocationUpdate('Trip', id);
        }
      })
      .catch((error) => {
        this.setState({ loading: false, retry: error });
        this.setConfirmModalVisibility(true);
        this.showActionModal(false);
      });
  }

  setReturnRidesModalVisibility = (show) => {
    this.setState({ showReturnRides: show });
  }

  setRecurringRidesModalVisibility = (show) => {
    this.setState({ showRecurringRides: show });
  }

  setSuggestedRidesVisibility = (show, comment = '') => {
    this.setState({ showSuggestedRides: show, comment });
  }

  setConfirmModalVisibility = (show) => {
    this.setState({ confirmModalVisibility: show, showActionOption: false });
  }

  showActionModal(visible) {
    this.setState({ showActionOption: visible });
  }

  checkValidation = (comment) => {
    const errors = [];
    if (comment === '') {
      errors.push('COMMENT_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  // isTripStartedForShareLocation = () => {
  //   const { trip } = this.state;
  //   return getDate(trip.date).subtract(40, 'minute').isBefore();
  // }

  isTripStarted = () => {
    const { trip } = this.state;
    return getDate(trip.date).add(trip.duration / 2, 'second').isBefore();
  }

  isTripEnded = () => {
    const { trip } = this.state;

    return getDate(trip.date)
      .add(trip.duration, 'second')
      .add(1, 'day')
      .isBefore();
  }

  redirectToSelectedTripDate = (day) => {
    const { trip } = this.state;
    const { navigation } = this.props;

    if (day.dateString === getDate(trip.date).format('YYYY-MM-DD')) {
      this.setRecurringRidesModalVisibility(false);
      return;
    }

    trip.Recurring.forEach((ride) => {
      if (getDate(ride.date).format('YYYY-MM-DD') === day.dateString) {
        this.setRecurringRidesModalVisibility(false);
        navigation.navigate('TripDetail', { id: ride.id });
      }
    });
  }

  redirectToSelectedReturnTrip = (id) => {
    const { trip } = this.state;
    const { navigation } = this.props;

    trip.ReturnTrip.forEach((ride) => {
      if (ride.id === id) {
        this.setReturnRidesModalVisibility(false);
        navigation.navigate('TripDetail', { id: ride.id });
      }
    });
  }

  canCreateExperience = () => {
    const { trip } = this.state;
    const { experienceStatus, Participants, isParticipant } = trip;

    if (experienceStatus) {
      return (
        Participants.count > 1
        && isParticipant
        && experienceStatus === EXPERIENCE_STATUS_CAN_CREATE
        && this.isTripStarted() && !this.isTripEnded()
      );
    }

    return false;
  }

  canShareLocation = () => {
    const { trip } = this.state;
    const { Participants, isParticipant } = trip;


    if ((Participants && Participants.count <= 1) || !isParticipant) {
      return false;
    }

    // if (!this.isTripStartedForShareLocation()) {
    //   return false;
    // }

    // if (this.isTripEnded()) {
    //   return false;
    // }

    return true;
  }

  returnRideButton = () => {
    const { trip } = this.state;
    if (!trip.ReturnTrip) {
      return null;
    }

    const icon = (<Image
      source={trip.type === FEED_TYPE_WANTED ? ReturnIconBlue : ReturnIconPink}
      style={styles.btnIcon}
    />);

    if (trip.ReturnTrip.length === 1 && trip.Recurring.length < 1) {
      return (
        <TouchableOpacity
          style={[styles.pillBtn, { maxWidth: '100%' }]}
          onPress={() => this.redirectToSelectedReturnTrip(trip.ReturnTrip[0].id)}
          activeOpacity={0.75}
        >
          {icon}
          <AppText color={Colors.text.gray}>
            <AppText color={Colors.text.gray} fontVariation="bold">{trans('detail.return_ride')}</AppText>
            <Date format="MMM DD, YYYY, HH:mm">{trip.ReturnTrip[0].date}</Date>
          </AppText>
        </TouchableOpacity>
      );
    }

    if (trip.ReturnTrip.length > 0) {
      return (
        <TouchableOpacity
          style={styles.pillBtn}
          onPress={() => this.setReturnRidesModalVisibility(true)}
          activeOpacity={0.75}
        >
          {icon}
          <AppText color={Colors.text.gray}>{trans('detail.return')}</AppText>
        </TouchableOpacity>
      );
    }

    return null;
  }

  recurringRideButton = () => {
    const { trip } = this.state;

    if (!trip.Recurring || trip.Recurring.length < 1) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.pillBtn}
        onPress={() => this.setRecurringRidesModalVisibility(true)}
        activeOpacity={0.75}
      >
        <Image source={CalendarIcon} style={styles.btnIcon} />
        <AppText color={Colors.text.gray}>{trans('detail.recurring')}</AppText>
      </TouchableOpacity>
    );
  }

  header = () => {
    const { error, success, trip } = this.state;
    let profileImage = null;
    if (trip.User.avatar) {
      profileImage = (
        <Avatar
          notTouchable
          isSupporter={trip.User.isSupporter}
          size={64}
          imageURI={trip.User.avatar}
          style={styles.profilePic}
        />
      );
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <View>
        <DetailHeader trip={trip} handleMapPress={() => this.onMapPress()} />
        <TouchableOpacity
          onPress={() => this.onProfilePress(trip.User.id)}
          style={styles.profilePicWrapper}
        >
          {profileImage}
        </TouchableOpacity>
        <LinearGradient colors={Gradients.white}>
          {this.renderDetail()}
          {this.renderRelation()}
          <View style={[styles.flexRow, styles.btnSection]}>
            {this.returnRideButton()}
            {this.recurringRideButton()}
          </View>
          {/* {this.renderExperienceButton()} */}
        </LinearGradient>
        <Toast message={error} type="error" />
        <Toast message={success} type="success" />
      </View>
    );
  }

  navigateOnDelete = () => {
    const { navigation } = this.props;
    navigation.popToTop();
    navigation.replace('Tab');
  }

  recurringRidesModal = () => {
    const { trip } = this.state;
    const markedDates = {};
    let selectedDate = '';
    let tripDate = '';
    let tripColor = '';

    if (trip.Recurring) {
      trip.Recurring.forEach((row, index) => {
        selectedDate = getDate(row.date);
        if (index === 0) {
          tripDate = selectedDate.format('MMM DD, YYYY HH:mm');
        }

        tripColor = (row.type === FEED_TYPE_WANTED) ?
          Colors.background.blue : Colors.background.pink;
        markedDates[selectedDate.format('YYYY-MM-DD')] = { startingDay: true, textColor: 'white', color: selectedDate.isBefore() ? Colors.background.gray : tripColor, endingDay: true };
      });
    }

    return (
      <Modal
        animationType="fade"
        transparent
        onRequestClose={() => this.setState({ recurringRidesModalVisible: false })}
        visible={this.state.recurringRidesModalVisible}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.75)' }}>
          <View style={styles.returnModalContent}>
            <Calendar
              current={tripDate}
              markedDates={markedDates}
              markingType={'period'}
              hideExtraDays
              onDayPress={day => this.redirectToSelectedTripDate(day)}
              theme={{
                'stylesheet.day.period': {
                  base: {
                    width: 34,
                    height: 34,
                    alignItems: 'center',
                  },
                  todayText: {
                    fontWeight: '500',
                    color: Colors.text.blue,
                  },
                },
              }}
            />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() =>
                  this.setRecurringRidesModalVisibility(false)}
              >
                <AppText color={Colors.text.blue}>{trans('global.cancel')}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  navigateOnDelete = () => {
    const { navigation } = this.props;
    navigation.popToTop();
    navigation.replace('Tab');
  }

  returnRideModal = () => {
    const { trip } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ returnRidesModalVisible: false })}
        visible={this.state.returnRidesModalVisible}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.75)' }}>
          <View style={styles.returnModalContent}>
            <ScrollView>
              <ReturnRides
                avatar={trip.User.avatar}
                trips={trip.ReturnTrip}
                type={trip.type}
                onPress={this.redirectToSelectedReturnTrip}
              />
            </ScrollView>
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => this.setReturnRidesModalVisibility(false)}
              >
                <AppText color={Colors.text.blue}>{trans('global.cancel')}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderRelation = () => {
    const { trip } = this.state;

    if (trip.User.relation && trip.User.relation.path) {
      return (<FOF relation={trip.User.relation} viewee={trip.User} />);
    }

    return null;
  }

  renderDetail = () => {
    const { trip } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.detail}>
        { // style={[styles.text, styles.lightText]}  style={styles.username}
        }
        <AppText color={Colors.text.darkGray}>
          <AppText fontVariation="semibold" color={Colors.text.blue}>{trip.User.firstName}</AppText>
          {
            trip.type === FEED_TYPE_OFFER &&
            <AppText> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </AppText>
          }
          {trip.type === FEED_TYPE_WANTED && <AppText> {trans('feed.asks_for_a_ride')}</AppText>}
        </AppText>
        <Heading fontVariation="bold" style={styles.fromTo}>
          {
            trip.TripStart.name ?
              trip.TripStart.name :
              UcFirst(trip.direction)
          } - {
            trip.TripEnd.name ?
              trip.TripEnd.name :
              UcFirst(trip.direction)
          }
        </Heading>
        <AppText color={Colors.text.darkGray} style={styles.date}>
          <Date format="MMM DD, YYYY HH:mm">{trip.date}</Date>
          {
            trip.flexibilityInfo && trip.flexibilityInfo.duration !== 0 &&
            <AppText size={13}>
              {trip.flexibilityInfo.type === FLEXIBILITY_EARLIER_TYPE ? ' -' : ' +'}
              {trip.flexibilityInfo.duration}
              {trip.flexibilityInfo.unit}
            </AppText>
          }
        </AppText>
        {
          trip.Stops.length > 0 &&
          <AppText size={18} color={Colors.text.darkGray} style={styles.text}>
            <AppText size={18} color={Colors.text.pink} fontVariation="semibold">{trans('detail.stops_in')} </AppText>
            {trip.Stops.map(place => place.name).join(', ')}
          </AppText>
        }
        <View style={styles.tripDescription}>
          <AppText style={styles.text}>
            {trip.description}
            {trip.Group && trip.Group.id &&
              <AppText>
                {' '}
                {trans('detail.i_added_ride_in_this_group')}
                <AppText
                  color={Colors.text.blue}
                  fontVariation="bold"
                  onPress={() => navigation.navigate('GroupDetail', { id: trip.Group.id, fetch: true })}
                >
                  {`${trip.Group.name.trim()}.`}
                </AppText>
                <AppText
                  color={Colors.text.blue}
                  onPress={() => navigation.navigate('GroupDetail', { id: trip.Group.id, fetch: true })}
                >
                  {' '}
                  {trans('detail.read_more_about_our_group')}
                </AppText>
              </AppText>
            }
            {
              trip.linkedTrip && trip.linkedTrip.id &&
              <AppText>
                {' '}
                {trans('detail.i_made_this_ride')}
                {' '}
                {trip.linkedTrip.User && trip.linkedTrip.User.firstName &&
                  <AppText
                    color={Colors.text.blue}
                    fontVariation="bold"
                    onPress={() => navigation.navigate('TripDetail', { id: trip.linkedTrip.id })}
                  >
                    {
                      `${trip.linkedTrip.User.firstName}'s `
                    }
                  </AppText>}
                <AppText
                  color={Colors.text.blue}
                  onPress={() => navigation.navigate('TripDetail', { id: trip.linkedTrip.id })}
                >
                  {trans('detail.question_for_a_ride')}
                </AppText>
              </AppText>
            }
          </AppText>
        </View>
      </View>
    );
  }

  renderRideSuggestions = () => {
    const { trip, comment, showSuggestedRides } = this.state;

    return (
      <Modal
        visible={showSuggestedRides}
        onRequestClose={() => this.setSuggestedRidesVisibility(false)}
        animationType="slide"
      >
        <SuggestedRides
          from={trip.TripStart.coordinates}
          to={trip.TripEnd.coordinates}
          direction={trip.direction}
          filters={[FEED_FILTER_OFFERED]}
          tripId={trip.id}
          onSubmit={this.setSuggestedRidesVisibility}
          defaultText={comment}
        />
      </Modal>
    );
  }

  renderParticipantsAction() {
    const { trip } = this.state;

    if (!trip.isParticipant) return null;

    return (
      <View>
        <ModalAction
          label={trans('detail.share_your_live_location')}
          onPress={() => this.onMapPress(true)}
          disabled={!this.canShareLocation()}
          icon={LocationIcon}
        />
        {
          trip.muted ?
            (
              <ModalAction
                label={trans('detail.unmute')}
                onPress={this.onUnmute}
              />
            ) :
            ([
              <ModalAction
                key="mute_two_hours"
                label={trans('detail.mute_two_hours')}
                onPress={() => this.onMute(2, 'hours')}
              />,
              <ModalAction
                key="mute_one_day"
                label={trans('detail.mute_one_day')}
                onPress={() => this.onMute(1, 'day')}
              />,
              <ModalAction
                key="mute_forever"
                label={trans('detail.mute_forever')}
                onPress={() => this.onMute('forever')}
              />,
            ])
        }
        <ModalAction disabled label={trans('detail.embeded_with_html')} onPress={() => null} />
      </View>
    );
  }

  renderActionModal() {
    const { user, navigation } = this.props;
    const { trip, showActionOption } = this.state;

    return (
      <ActionModal
        animationType="fade"
        transparent
        onRequestClose={() => this.setState({ showActionOption: false })}
        visible={showActionOption}
      >
        <ModalAction
          label={trans('detail.create_your_experience')}
          onPress={() => {
            this.setState({ showActionOption: false });
            navigation.navigate('Experience', { trip });
          }}
          disabled={!this.canCreateExperience()}
        />
        {this.renderParticipantsAction()}
        {
          user.id !== trip.User.id ?
            <ModalAction
              label={trans('detail.report_this_ride')}
              onPress={this.onReport}
            /> :
            <ModalAction
              label={trans('detail.delete_this_ride')}
              onPress={() => this.setConfirmModalVisibility(true)}
            />
        }
      </ActionModal>
    );
  }

  renderExperienceButton = () => {
    const { navigation } = this.props;
    const { trip } = this.state;

    if (this.canCreateExperience() && this.isTripStarted() && !this.isTripEnded()) {
      return (
        <MakeExperience
          handlePress={() => navigation.navigate('Experience', { trip })}
        />
      );
    }

    if (trip.experienceStatus === EXPERIENCE_STATUS_PENDING) {
      return (
        <View style={styles.experienceWrapper}>
          <View style={styles.experienceIconWrapper}>
            <Image source={ExperienceIcon} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText>{trans('detail.someone_has_already_created_an_experience')}</AppText>
          </View>
        </View>
      );
    }

    return null;
  }

  renderShareModal() {
    const { showShareModal, trip } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={FEEDABLE_TRIP}
          detail={trip}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderAppNotification = () => {
    const { notification, notifier, notificationMessage } = this.state;

    if (notification) {
      return (
        <AppNotification
          image={notifier.avatar}
          type={notifier.type || 'image'}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />
      );
    }

    return null;
  }

  renderCommentBox = () => {
    const { trip, loading } = this.state;

    if (trip.type === FEED_FILTER_OFFERED) {
      return (
        <OfferCommentBox
          loading={loading}
          handleShowOptions={() => this.showActionModal(true)}
          handleSend={this.onSubmit}
          trip={trip}
        />
      );
    }

    return (
      <AskCommentBox
        loading={loading}
        handleShowOptions={() => this.showActionModal(true)}
        onSuggest={this.setSuggestedRidesVisibility}
        handleSend={this.onSubmit}
        onOffer={this.onOffer}
        onBlur={this.onCommentBoxBlur}
      />
    );
  }

  renderButton = () => {
    const { loading } = this.state;
    const content = loading ? <Loading /> : <AppText>Send</AppText>;
    return (
      <TouchableOpacity onPress={this.onSubmit} style={styles.send}>
        {content}
      </TouchableOpacity>);
  }

  renderConfirmModal = () => {
    const { loading, confirmModalVisibility, retry, trip } = this.state;

    const message = (
      <AppText>
        {trans('detail.sure_to_delete_trip_?')}
        {
          ((trip.ReturnTrip && trip.ReturnTrip.length > 0) ||
            (trip.Recurring && trip.Recurring.length > 0)) &&
          trans('detail.deleting_trip_will_delete_all_trips_associated')
        }
      </AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={retry ? trans('global.retry') : trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={() => this.onDelete()}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderDeletedModal = () => {
    const { deletedModal } = this.state;

    const message = (
      <AppText>{trans('detail.this_trip_has_been_deleted')}</AppText>
    );

    return (
      <DeletedModal
        visible={deletedModal}
        onRequestClose={() => this.setState({ deletedModal: false })}
        message={message}
        onConfirm={() => this.setState({ deletedModal: false, confirmModalVisibility: false },
          () => this.navigateOnDelete())}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderTrip() {
    const { notifierOffset, trip } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {this.renderAppNotification()}
        <ToolBar transparent offset={notifierOffset} />
        {this.state.showReturnRides && this.returnRideModal()}
        {this.state.showRecurringRides && this.recurringRidesModal()}
        <TripFeed
          id={trip.id}
          header={this.header()}
          footer={<About />}
          type={FEEDABLE_TRIP}
          ownerId={trip.User.id}
          isAdmin={trip.isAdmin}
        />
        {this.renderCommentBox()}
        {this.renderActionModal()}
        {this.renderShareModal()}
        {this.renderRideSuggestions()}
        {this.renderConfirmModal()}
      </View>
    );
  }

  render() {
    const { trip } = this.state;

    if (!trip.User) {
      return (
        <Loading style={styles.loading} />
      );
    }

    return (
      <Wrapper>
        {!trip.isDeleted && this.renderTrip()}
        {this.renderDeletedModal()}
      </Wrapper>
    );
  }
}

TripDetail.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToTrip: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  deleteTrip: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user, nav: state.nav });

const TripWithDetail = compose(
  withShare,
  submitComment,
  withTrip,
  withMute,
  withUnmute,
  withDeleteTrip,
  connect(mapStateToProps),
)(TripDetail);

const TripScreen = ({ navigation }) => {
  const { id } = navigation.state.params;

  return (<TripWithDetail id={id} navigation={navigation} />);
};

TripScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

TripScreen.navigationOptions = {
  header: null,
};

export default TripScreen;
