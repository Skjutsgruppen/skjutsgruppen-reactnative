import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, Keyboard } from 'react-native';
import { compose } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import { submitComment } from '@services/apollo/comment';
import { withShare } from '@services/apollo/share';
import { withTrip, withTripFeed } from '@services/apollo/trip';
import { AppNotification, DetailHeader, Loading, ShareButton } from '@components/common';
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
import { getDate } from '@config';
import { FLEXIBILITY_EARLIER_TYPE, FEED_FILTER_OFFERED, FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED, EXPERIENCE_STATUS_PENDING, EXPERIENCE_STATUS_CAN_CREATE } from '@config/constant';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';
import { connect } from 'react-redux';
import { withSearch } from '@services/apollo/search';
import SuggestedRidesList from '@components/ask/suggestedRidesList';
import AskCommentBox from '@components/ask/commentBox';
import OfferCommentBox from '@components/offer/commentBox';
import ToolBar from '@components/utils/toolbar';
import Feed from '@components/feed/list';
import { Wrapper } from '@components/common/index';
import { withMute, withUnmute } from '@services/apollo/mute';

const SuggestedRides = withSearch(SuggestedRidesList);
const TripFeed = withTripFeed(Feed);

const styles = StyleSheet.create({
  bold: {
    fontWeight: '600',
  },
  wrapper: {
    flex: 1,
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
    top: 224 - (60 / 2),
    right: 20,
    zIndex: 20,
  },
  profilePic: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border.white,
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
    lineHeight: 22,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  stopsLabel: {
    color: Colors.text.pink,
    fontWeight: 'bold',
  },
  fromTo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginVertical: 12,
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
    backgroundColor: '#f6f9fc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  btnIcon: {
    marginRight: 16,
  },
  btnLabel: {
    fontSize: 16,
    color: Colors.text.gray,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 16,
  },
  actionsWrapper: {
    marginTop: 'auto',
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  dividerWrapper: {
    marginHorizontal: 24,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  closeWrapper: {
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
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
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      right: () => <ShareButton onPress={() => this.setState({ showShareModal: true })} />,
    });

    const { notifier, notificationMessage, trip } = navigation.state.params;
    let initialState = { trip };

    if (notifier) {
      initialState = {
        ...initialState,
        ...{ notifier, notificationMessage, notification: true, notifierOffset: 70 },
      };
    }

    this.setState(initialState);
  }

  componentWillReceiveProps({ trip, loading }) {
    if (!loading && trip.id) {
      if (trip.experienceStatus === EXPERIENCE_STATUS_PENDING) {
        const notifier = {
          firstName: '',
          avatar: ExperienceIcon,
          type: 'icon',
        };

        const notificationMessage = 'Someone has already created an experience for this ride';
        this.setState({
          trip,
          loading,
          notificationMessage,
          notifier,
          notification: true,
          notifierOffset: 70,
        });
      } else {
        this.setState({ trip, loading });
      }
    }
  }

  onSubmit = (comment) => {
    this.setState({ loading: true });
    const { submit } = this.props;
    const { trip } = this.state;
    const validation = this.checkValidation(comment);

    if (validation.pass()) {
      try {
        submit({ tripId: trip.id, text: comment }).then(() => {
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

  onMapPress = () => {
    const { navigation } = this.props;
    const { trip } = this.state;
    const tripType = trip.type;
    const coordinates = {
      start: trip.TripStart,
      end: trip.TripEnd,
      stops: trip.Stops,
    };

    navigation.navigate('Route', { coordinates, tripType });
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
    mute(data).then(refetch);
  }

  onUnmute = () => {
    const { trip } = this.state;
    const { unmute, refetch } = this.props;

    this.showActionModal(false);
    unmute({
      mutable: 'Trip',
      mutableId: trip.id,
    }).then(refetch);
  }

  onReport = () => {
    const { navigation } = this.props;
    const { trip } = this.state;
    this.showActionModal(false);
    navigation.navigate('Report', { data: { Trip: trip }, type: FEEDABLE_TRIP });
  }

  onCommentBoxBlur = comment => this.setState({ comment });

  setReturnRidesModalVisibility = (show) => {
    this.setState({ showReturnRides: show });
  }

  setRecurringRidesModalVisibility = (show) => {
    this.setState({ showRecurringRides: show });
  }

  setSuggestedRidesVisibility = (show, comment = '') => {
    this.setState({ showSuggestedRides: show, comment });
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
        navigation.navigate('TripDetail', { trip: ride });
      }
    });
  }

  redirectToSelectedReturnTrip = (id) => {
    const { trip } = this.state;
    const { navigation } = this.props;

    trip.ReturnTrip.forEach((ride) => {
      if (ride.id === id) {
        this.setReturnRidesModalVisibility(false);
        navigation.navigate('TripDetail', { trip: ride });
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
      );
    }

    return false;
  }

  returnRideButton = () => {
    const { trip } = this.state;
    if (!trip.ReturnTrip) {
      return null;
    }

    if (trip.ReturnTrip.length === 1 && trip.Recurring.length < 1) {
      return (
        <TouchableOpacity
          style={[styles.pillBtn, { maxWidth: '100%' }]}
          onPress={() => this.redirectToSelectedReturnTrip(trip.ReturnTrip[0].id)}
          activeOpacity={0.75}
        >
          <Image source={require('@assets/icons/ic_return.png')} style={styles.btnIcon} />
          <Text style={styles.btnLabel}>
            <Text style={styles.bold}>{trans('trip.return_ride')}</Text>
            <Date format="MMM DD, YYYY, HH:mm">{trip.ReturnTrip[0].date}</Date>
          </Text>
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
          <Image source={require('@assets/icons/ic_return.png')} style={styles.btnIcon} />
          <Text style={[styles.btnLabel, styles.bold]}>{trans('trip.return')}</Text>
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
        <Image source={require('@assets/icons/ic_calender.png')} style={styles.btnIcon} />
        <Text style={[styles.btnLabel, styles.bold]}>{trans('trip.recurring')}</Text>
      </TouchableOpacity>
    );
  }

  header = () => {
    const { error, success, trip } = this.state;

    let profileImage = null;
    if (trip.User.avatar) {
      profileImage = (<Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <View>
        <DetailHeader trip={trip} handleMapPress={this.onMapPress} />
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
          {this.renderExperienceButton()}
        </LinearGradient>
        <Toast message={error} type="error" />
        <Toast message={success} type="success" />
      </View>
    );
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
        animationType="slide"
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
            />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() =>
                  this.setRecurringRidesModalVisibility(false)}
              >
                <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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
            <ReturnRides
              avatar={trip.User.avatar}
              trips={trip.ReturnTrip}
              type={trip.type}
              onPress={this.redirectToSelectedReturnTrip}
            />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => this.setReturnRidesModalVisibility(false)}
              >
                <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
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
    return (
      <View style={styles.detail}>
        <Text style={[styles.text, styles.lightText]}>
          <Text style={styles.username}>
            {trip.User.firstName}
          </Text>
          {
            trip.type === FEED_TYPE_OFFER &&
            <Text> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
          }
          {trip.type === FEED_TYPE_WANTED && <Text> {trans('feed.asks_for_a_ride')}</Text>}
        </Text>
        <Text style={styles.fromTo}>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
        <Text style={[styles.date, styles.lightText]}>
          <Date format="MMM DD, YYYY HH:mm">{trip.date}</Date>
          {
            trip.flexibilityInfo && trip.flexibilityInfo.duration !== 0 &&
            <Text style={{ fontSize: 13, color: Colors.text.gray }}>
              {trip.flexibilityInfo.type === FLEXIBILITY_EARLIER_TYPE ? ' -' : ' +'}
              {trip.flexibilityInfo.duration}
              {trip.flexibilityInfo.unit}
            </Text>
          }
        </Text>
        {
          trip.Stops.length > 0 &&
          <Text style={[styles.text, styles.lightText]}>
            <Text style={styles.stopsLabel}>{trans('trip.stops_in')} </Text>
            {trip.Stops.map(place => place.name).join(', ')}
          </Text>
        }
        <View style={styles.tripDescription}>
          <Text style={[styles.text]}>{trip.description}</Text>
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
          filters={[FEED_FILTER_OFFERED]}
          tripId={trip.id}
          onSubmit={this.setSuggestedRidesVisibility}
          defaultText={comment}
        />
      </Modal>
    );
  }

  renderActionModal() {
    const { navigation, user } = this.props;
    const { trip, showActionOption } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ showActionOption: false })}
        visible={showActionOption}
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {
              this.canCreateExperience() ?
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => {
                    this.setState({ showActionOption: false });
                    navigation.navigate('Experience', { trip });
                  }}
                >
                  <Text style={styles.actionLabel}>{trans('trip.create_your_experience')}</Text>
                </TouchableOpacity>
                :
                <Text style={[styles.action, styles.actionLabel, { color: Colors.text.gray }]}>{trans('trip.create_your_experience')}</Text>
            }
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.share_your_live_location')} </Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            {
              trip.muted ?
                (
                  <TouchableOpacity
                    style={styles.action}
                    onPress={this.onUnmute}
                  >
                    <Text style={styles.actionLabel}>{trans('trip.unmute')}</Text>
                  </TouchableOpacity>
                ) :
                (<View>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => this.onMute(2, 'hours')}
                  >
                    <Text style={styles.actionLabel}>{trans('trip.mute_two_hours')}</Text>
                  </TouchableOpacity>
                  <View style={styles.horizontalDivider} />
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => this.onMute(1, 'day')}
                  >
                    <Text style={styles.actionLabel}>{trans('trip.mute_one_day')}</Text>
                  </TouchableOpacity>
                  <View style={styles.horizontalDivider} />
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => this.onMute('forever')}
                  >
                    <Text style={styles.actionLabel}>{trans('trip.mute_forever')}</Text>
                  </TouchableOpacity>
                </View>)
            }
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.embeded_with_html')}</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            {
              user.id !== trip.User.id &&
              <TouchableOpacity
                style={styles.action}
                onPress={this.onReport}
              >
                <Text style={styles.actionLabel}>{trans('trip.report_this_ride')}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => this.showActionModal(!showActionOption)}
            >
              <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
            <Text>Someone has already created an experience for this ride.</Text>
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
    const content = loading ? <Loading /> : <Text style={styles.sendText}>Send</Text>;
    return (
      <TouchableOpacity onPress={this.onSubmit} style={styles.send}>
        {content}
      </TouchableOpacity>);
  }

  render() {
    const { notifierOffset, trip } = this.state;

    if (!trip.User) {
      return (
        <View style={styles.wrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <Wrapper>
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
      </Wrapper>
    );
  }
}

TripDetail.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const TripWithDetail = compose(
  withShare,
  submitComment,
  withTrip,
  withMute,
  withUnmute,
  connect(mapStateToProps),
)(TripDetail);

const TripScreen = ({ navigation }) => {
  const { trip } = navigation.state.params;
  return (<TripWithDetail id={trip.id} navigation={navigation} />);
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
