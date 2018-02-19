import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal, Keyboard } from 'react-native';
import { compose } from 'react-apollo';
import { submitComment, withTripComment } from '@services/apollo/comment';
import { withShare } from '@services/apollo/share';
import { withTrip } from '@services/apollo/trip';
import { withTripExperiences } from '@services/apollo/experience';
import { FloatingNavbar, AppNotification, DetailHeader, CommentBox, Loading } from '@components/common';
import { getToast } from '@config/toast';
import { Calendar } from 'react-native-calendars';
import { trans } from '@lang/i18n';
import Comment from '@components/comment/list';
import Relation from '@components/relation';
import MakeExperience from '@components/experience/make';
import PropTypes from 'prop-types';
import List from '@components/experience/list';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import Date from '@components/date';
import Toast from '@components/toast';
import ReturnRides from '@components/offer/returnRides';
import About from '@components/common/about';
import { getDate } from '@config';
import { FEEDABLE_TRIP, FEED_TYPE_OFFER, FEED_TYPE_WANTED, EXPERIENCE_STATUS_PENDING, EXPERIENCE_STATUS_PUBLISHED, EXPERIENCE_STATUS_CAN_CREATE } from '@config/constant';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';

const TripComment = withTripComment(Comment);
const TripExperiences = withTripExperiences(List);

const styles = StyleSheet.create({
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
  userComment: {
    margin: 24,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  relationLabelWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  relationLabel: {
    fontSize: 12,
  },
  chevronDown: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    marginLeft: 16,
    marginTop: 2,
  },
  btnSection: {
    justifyContent: 'space-around',
    paddingVertical: 24,
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
    shadowRadius: 40,
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
    fontWeight: 'bold',
    color: Colors.text.gray,
  },
  commentsWrapper: {
    paddingBottom: 50,
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
  experienceTitle: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

class TripDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      error: '',
      success: '',
      comment: '',
      modalVisible: false,
      writingComment: false,
      isOpen: false,
      notification: false,
      notifierOffset: 0,
      showReturnRides: false,
      showRecurringRides: false,
      trip: {},
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
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

  onSharePress = () => {
    this.setState({ isOpen: true });
  }

  onShare = (share) => {
    this.props.share({ id: this.state.trip.id, type: FEEDABLE_TRIP, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onProfilePress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { profileId: id });
  }

  onCommentChange = (text) => {
    this.setState({ comment: text });
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setReturnRidesModalVisibility = (show) => {
    this.setState({ showReturnRides: show });
  }

  setRecurringRidesModalVisibility = (show) => {
    this.setState({ showRecurringRides: show });
  }

  handleBlur = () => {
    this.setState({ writingComment: false });
  }

  handleFocus = () => {
    this.setState({ writingComment: true });
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

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
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

  renderButton = () => {
    const { loading } = this.state;
    const content = loading ? <Loading /> : <Text style={styles.sendText}>Send</Text>;
    return (
      <TouchableOpacity onPress={this.onSubmit} style={styles.send}>
        {content}
      </TouchableOpacity>);
  }

  renderModal() {
    const { navigation } = this.props;
    const { trip, modalVisible } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ modalVisible: false })}
        visible={modalVisible}
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {
              this.canCreateExperience() &&
              <TouchableOpacity
                style={styles.action}
                onPress={() => {
                  this.setState({ modalVisible: false });
                  navigation.navigate('Experience', { trip });
                }}
              >
                <Text style={styles.actionLabel}>{trans('trip.create_your_experience')}</Text>
              </TouchableOpacity>
            }
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.share_your_live_location')} </Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.mute_two_hours')}</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.mute_one_day')}</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.mute_forever')}</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.embeded_with_html')}</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>{trans('trip.report_this_ride')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => this.setModalVisible(!modalVisible)}
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
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
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

  render() {
    const { error, success, notifierOffset, trip, loading } = this.state;

    if (!trip.User) {
      return (
        <View style={styles.wrapper}>
          <Loading />
        </View>
      );
    }

    let profileImage = null;
    if (trip.User.avatar) {
      profileImage = (<Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

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
      <View style={styles.wrapper}>
        {this.renderAppNotification()}
        <FloatingNavbar
          handleBack={this.goBack}
          showShare
          handleShare={this.onSharePress}
          transparent
          offset={notifierOffset}
        />
        <ScrollView>
          <DetailHeader trip={trip} handleMapPress={this.onMapPress} />
          <TouchableOpacity
            onPress={() => this.onProfilePress(trip.User.id)}
            style={styles.profilePicWrapper}
          >
            {profileImage}
          </TouchableOpacity>
          <View style={styles.detail}>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.username} onPress={() => { }}>
                {trip.User.firstName}
              </Text>
              {
                trip.type === FEED_TYPE_OFFER &&
                <Text> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
              }
              {trip.type === FEED_TYPE_WANTED && <Text> {trans('feed.asks_for_a_ride')}</Text>}
            </Text>
            <Text style={styles.fromTo}>{trip.TripStart.name} - {trip.TripEnd.name}</Text>
            <Text style={[styles.date, styles.lightText]}><Date format="MMM DD, YYYY HH:mm">{trip.date}</Date></Text>
            {
              trip.Stops.length > 0 &&
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.stopsLabel}>{trans('trip.stops_in')} </Text>
                {trip.Stops.map(place => place.name).join(', ')}
              </Text>
            }
            <View style={[styles.flexRow, styles.btnSection]}>
              {
                trip.ReturnTrip && trip.ReturnTrip.length > 0 &&
                <TouchableOpacity
                  style={styles.pillBtn}
                  onPress={() => this.setReturnRidesModalVisibility(true)}
                >
                  <Image source={require('@assets/icons/ic_return.png')} style={styles.btnIcon} />
                  <Text style={styles.btnLabel}>{trans('trip.return')}</Text>
                </TouchableOpacity>
              }
              {
                trip.Recurring && trip.Recurring.length > 0 &&
                <TouchableOpacity
                  style={styles.pillBtn}
                  onPress={() => this.setRecurringRidesModalVisibility(true)}
                >
                  <Image source={require('@assets/icons/ic_calender.png')} style={styles.btnIcon} />
                  <Text style={styles.btnLabel}>{trans('trip.recurring')}</Text>
                </TouchableOpacity>
              }
            </View>
            {
              this.state.showReturnRides &&
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
            }
            {
              this.state.showRecurringRides &&
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
            }
          </View>
          <View style={styles.userComment}>
            <Text style={[styles.text]}>{trip.description}</Text>
          </View>
          {
            trip.User.relation && trip.User.relation.length > 0 &&
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text>{trans('trip.this_is_how_you_know')} {trip.User.firstName}</Text>
              <Relation
                users={trip.User.relation}
                avatarSize={45}
              />
            </View>
          }
          <View style={styles.dividerWrapper}>
            <View style={styles.horizontalDivider} />
          </View>
          <Toast message={error} type="error" />
          <Toast message={success} type="success" />
          {
            (trip.experienceStatus === EXPERIENCE_STATUS_PUBLISHED) &&
            <TripExperiences title="Experiences!" tripId={trip.id} />
          }

          {this.renderExperienceButton()}
          <View style={styles.dividerWrapper}>
            <View style={styles.horizontalDivider} />
          </View>
          <TripComment
            onCommentPress={this.onProfilePress}
            id={trip.id}
            ownerId={trip.User.id}
          />
          <About />
        </ScrollView>
        <CommentBox
          handleSend={this.onSubmit}
          loading={loading}
          handleShowOptions={() => this.setModalVisible(true)}
        />
        {this.renderModal()}
        {this.renderShareModal()}
      </View>
    );
  }
}

TripDetail.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  share: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const TripWithDetail = compose(withShare, submitComment, withTrip)(TripDetail);

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
