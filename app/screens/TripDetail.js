import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, Modal, Keyboard } from 'react-native';
import { compose } from 'react-apollo';
import { submitComment, withTripComment } from '@services/apollo/comment';
import { withShare } from '@services/apollo/share';
import { withTrip } from '@services/apollo/trip';
import { withTripExperiences } from '@services/apollo/experience';
import { Loading, FloatingNavbar, AppNotification, DetailHeader } from '@components/common';
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
  footer: {
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 2,
    borderColor: Colors.border.lightGray,
  },
  footerCommentSection: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerSocialSection: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  moreIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
  },
  moreIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  commentInput: {
    height: '100%',
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
  },
  send: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sendText: {
    color: Colors.text.blue,
    fontWeight: 'bold',
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
    const { notifier, trip } = navigation.state.params;
    let initialState = { trip };

    if (notifier) {
      initialState = { ...initialState, ...{ notification: true, notifierOffset: 70 } };
    }

    this.setState(initialState);
  }

  componentWillReceiveProps({ trip, loading }) {
    if (!loading && trip.id) {
      this.setState({ trip, loading });
    }
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit } = this.props;
    const { comment, trip } = this.state;
    const validation = this.checkValidation();

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
    this.props.share({ id: this.state.trip.id, type: 'Trip', share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onProfilePress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('UserProfile', { profileId: id });
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

  checkValidation() {
    const errors = [];
    const { comment } = this.state;

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
    const canCreateExperience = trip.totalComments > 0 && trip.isParticipant;

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
              canCreateExperience &&
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

    if (
      trip.totalComments < 1 || !trip.isParticipant
      || !this.isTripStarted() || !this.isTripEnded()
    ) {
      return null;
    }

    return (
      <MakeExperience
        handlePress={() => navigation.navigate('Experience', { trip })}
      />
    );
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


  renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerCommentSection}>
        {
          !this.state.writingComment &&
          <TouchableOpacity
            style={styles.moreIconWrapper}
            onPress={() => this.setModalVisible(true)}
          >
            <Image source={require('@assets/icons/ic_options.png')} style={styles.moreIcon} />
          </TouchableOpacity>
        }
        <TextInput
          value={this.state.comment}
          onChangeText={text => this.onCommentChange(text)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholderTextColor="#000"
          placeholder={trans('global.write')}
          multiline
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          style={styles.commentInput}
          editable={!this.state.loading}
        />
        {
          this.state.writingComment &&
          this.renderButton()
        }
      </View>
      {
        this.state.writingComment &&
        <View style={styles.footerSocialSection}>
          <Text>{trans('trip.a_post_on_your_fb_timeline')}</Text>
          <Text style={{ marginLeft: 12 }}>{trans('trip.a_tweet')}</Text>
        </View>
      }
    </View>
  );

  render() {
    const { navigation } = this.props;
    const { notifier, notificationMessage } = navigation.state.params;
    const { error, success, notification, notifierOffset, trip } = this.state;

    let profileImage = null;
    if (trip.User.avatar) {
      profileImage = (<Image source={{ uri: trip.User.avatar }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    const markedDates = {};
    let selectedDate = '';
    let tripDate = '';

    if (trip.Recurring) {
      trip.Recurring.forEach((row, index) => {
        selectedDate = getDate(row.date);
        if (index === 0) {
          tripDate = selectedDate.format('MMM DD, YYYY HH:mm');
        }

        markedDates[selectedDate.format('YYYY-MM-DD')] = [
          {
            startingDay: true,
            color: selectedDate.isBefore() ? Colors.background.gray : Colors.background.pink,
            textColor: '#fff',
          },
          {
            endingDay: true,
            color: selectedDate.isBefore() ? Colors.background.gray : Colors.background.pink,
            textColor: '#fff',
          },
        ];
      });
    }

    return (
      <View style={styles.wrapper}>
        <FloatingNavbar
          handleBack={this.goBack}
          showShare
          handleShare={this.onSharePress}
          offset={notifierOffset}
        />
        {notification && <AppNotification
          image={notifier.avatar}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
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
              <Text> {trans('feed.offers')} {trip.seats} {trip.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
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
                      markingType="interactive"
                      hideExtraDays
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
          <TripExperiences title="Experiences!" tripId={trip.id} />
          {this.renderExperienceButton()}
          <View style={styles.dividerWrapper}>
            <View style={styles.horizontalDivider} />
          </View>
          <TripComment
            onCommentPress={this.onProfilePress}
            id={trip.id}
          />
          <About />
        </ScrollView>
        {this.renderFooter()}
        {this.renderModal()}
        {this.renderShareModal()}
      </View>
    );
  }
}

TripDetail.propTypes = {
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
