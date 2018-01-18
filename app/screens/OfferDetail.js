import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, Modal, Keyboard } from 'react-native';
import { submitComment, withTripComment } from '@services/apollo/comment';
import { Loading, FloatingNavbar, AppNotification, DetailHeader } from '@components/common';
import Comment from '@components/comment/list';
import Relation from '@components/relation';
import MakeExperience from '@components/experience/make';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/auth';
import { compose } from 'react-apollo';
import Date from '@components/date';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import ReturnRides from '@components/offer/returnRides';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import { withTripExperiences } from '@services/apollo/experience';
import List from '@components/experience/list';
import About from '@components/common/about';
import { getTimezone } from '@helpers/device';
import { trans } from '@lang/i18n';

const OfferComment = withTripComment(Comment);
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

class OfferDetail extends Component {
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
      modalDetail: {},
      modalType: '',
      isOpen: false,
      notification: false,
      notifierOffset: 0,
      showReturnRides: false,
      showRecurringRides: false,
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { notifier } = navigation.state.params;

    if (notifier) {
      this.setState({ notification: true, notifierOffset: 70 });
    }
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, navigation } = this.props;
    const { comment } = this.state;
    const { offer } = navigation.state.params;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit({ tripId: offer.id, text: comment }).then(() => {
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

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  }

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
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
    const { offer } = navigation.state.params;
    const tripType = offer.type;
    const coordinates = {
      start: offer.TripStart,
      end: offer.TripEnd,
      stops: offer.Stops,
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
    const { navigation } = this.props;
    const { offer } = navigation.state.params;

    return Moment(offer.date).tz(getTimezone()).add(offer.duration / 2, 'second').isBefore();
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
    const { offer } = navigation.state.params;
    const canCreateExperience = offer.totalComments > 0 && offer.isParticipant;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ modalVisible: false })}
        visible={this.state.modalVisible}
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {
              canCreateExperience &&
              <TouchableOpacity
                style={styles.action}
                onPress={() => {
                  this.setState({ modalVisible: false });
                  navigation.navigate('Experience', { trip: offer });
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
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
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
    const { offer } = navigation.state.params;

    if (offer.totalComments < 1 || !offer.isParticipant || !this.isTripStarted()) return null;

    return (
      <MakeExperience
        handlePress={() => navigation.navigate('Experience', { trip: offer })}
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
            showGroup={this.state.modalType !== 'group'}
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
            <Image source={require('@icons/ic_options.png')} style={styles.moreIcon} />
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
    const { offer, notifier, notificationMessage } = navigation.state.params;
    const { error, success, notification, notifierOffset } = this.state;

    let profileImage = null;
    if (offer.User.avatar) {
      profileImage = (<Image source={{ uri: offer.User.avatar }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    const markedDates = {};
    let selectedDate = '';
    let tripDate = '';

    offer.Recurring.forEach((trip, index) => {
      selectedDate = Moment(trip.date).tz(getTimezone());
      if (index === 0) {
        tripDate = selectedDate.format('YYYY-MM-DD');
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

    return (
      <View style={styles.wrapper}>
        <FloatingNavbar
          handleBack={this.goBack}
          showShare
          handleShare={() => this.onSharePress('offer', offer)}
          offset={notifierOffset}
        />
        {notification && <AppNotification
          image={notifier.avatar}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
        <ScrollView>
          <DetailHeader trip={offer} handleMapPress={this.onMapPress} />
          <TouchableOpacity
            onPress={() => this.onProfilePress(offer.User.id)}
            style={styles.profilePicWrapper}
          >
            {profileImage}
          </TouchableOpacity>
          <View style={styles.detail}>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.username} onPress={() => { }}>
                {offer.User.firstName || offer.User.email}
              </Text>
              <Text> {trans('feed.offers')} {offer.seats} {offer.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
            </Text>
            <Text style={styles.fromTo}>{offer.TripStart.name} - {offer.TripEnd.name}</Text>
            <Text style={[styles.date, styles.lightText]}><Date format="MMM DD, YYYY HH:mm">{offer.date}</Date></Text>
            {
              offer.Stops.length > 0 &&
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.stopsLabel}>{trans('trip.stops_in')} </Text>
                {offer.Stops.map(place => place.name).join(', ')}
              </Text>
            }
            <View style={[styles.flexRow, styles.btnSection]}>
              {
                offer.ReturnTrip.length > 0 &&
                <TouchableOpacity
                  style={styles.pillBtn}
                  onPress={() => this.setReturnRidesModalVisibility(true)}
                >
                  <Image source={require('@icons/ic_return.png')} style={styles.btnIcon} />
                  <Text style={styles.btnLabel}>{trans('trip.return')}</Text>
                </TouchableOpacity>
              }
              {
                offer.Recurring.length > 0 &&
                <TouchableOpacity
                  style={styles.pillBtn}
                  onPress={() => this.setRecurringRidesModalVisibility(true)}
                >
                  <Image source={require('@icons/ic_calender.png')} style={styles.btnIcon} />
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
                      avatar={offer.User.avatar}
                      trips={offer.ReturnTrip}
                      type={offer.type}
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
            <Text style={[styles.text]}>{offer.description}</Text>
          </View>
          {
            offer.User.relation.length > 0 &&
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text>{trans('trip.this_is_how_you_know')} {offer.User.firstName}</Text>
              <Relation
                navigation={navigation}
                users={offer.User.relation}
                avatarSize={45}
              />
            </View>
          }
          <View style={styles.dividerWrapper}>
            <View style={styles.horizontalDivider} />
          </View>
          <Toast message={error} type="error" />
          <Toast message={success} type="success" />
          <TripExperiences title="Experiences!" tripId={offer.id} />
          {this.renderExperienceButton()}
          <View style={styles.dividerWrapper}>
            <View style={styles.horizontalDivider} />
          </View>
          <OfferComment
            navigation={navigation}
            onCommentPress={this.onProfilePress}
            id={offer.id}
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

OfferDetail.propTypes = {
  share: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withShare, submitComment)(OfferDetail);
