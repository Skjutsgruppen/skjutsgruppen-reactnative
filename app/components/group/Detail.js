import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed, withGroupTrips } from '@services/apollo/group';
import { withLeaveGroup } from '@services/apollo/notification';
import { AppNotification, Wrapper, Loading, FloatingNavbar } from '@components/common';
import Colors from '@theme/colors';
import GroupFeed from '@components/feed/list';
import GroupImage from '@components/group/groupImage';
import Share from '@components/common/share';
import { FEEDABLE_GROUP, STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import MapToggle from '@components/group/mapToggle';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import GroupCalendar from '@components/group/groupCalendar';
import CommentBox from '@components/group/commentBox';

const GroupFeedList = withGroupFeed(GroupFeed);
const Calendar = withGroupTrips(GroupCalendar);

const styles = StyleSheet.create({
  leaveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    bottom: 12,
    height: 32,
    width: 120,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  leaving: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leavingText: {
    marginRight: 4,
  },
  leaveText: {
    fontSize: 13,
    color: Colors.text.darkGray,
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3ed',
    borderTopWidth: 2,
    borderColor: '#cececf',
    paddingVertical: 9,
    paddingLeft: 24,
    paddingRight: 12,
  },
  msgInput: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#b1abab',
    paddingHorizontal: 12,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
  },
  sendText: {
    color: '#00aeef',
    fontWeight: 'bold',
  },
  calendarIcon: {
    paddingRight: 10,
  },
  groupCalendarContent: {
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
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
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
});

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      group: {},
      loading: false,
      leaveLoading: false,
      error: '',
      success: '',
      comment: '',
      showShareModal: false,
      notification: false,
      notifierOffset: 0,
      showCalendar: false,
      groupTrips: [],
      modalVisibility: false,
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { notifier } = navigation.state.params;

    if (notifier) {
      this.setState({ notification: true, notifierOffset: 70 });
    }
  }

  onSubmit = (comment) => {
    this.setState({ loading: true });
    const { submit, group } = this.props;
    const validation = this.checkValidation(comment);

    if (validation.pass()) {
      try {
        submit({ groupId: group.id, text: comment }).then(() => {
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

  onCommentPress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { profileId: id });
  }

  onPress = () => {
    const { navigation, group } = this.props;

    navigation.navigate('Profile', { profileId: group.User.id });
  }

  onMapPress = () => {
    const { navigation, group } = this.props;

    if (group.outreach === STRETCH_TYPE_AREA && group.areaCoordinates) {
      const coordinates = { area: group.areaCoordinates };

      navigation.navigate('Area', { coordinates });
    }

    if (group.outreach === STRETCH_TYPE_ROUTE) {
      const coordinates = {
        start: group.TripStart,
        end: group.TripEnd,
        stops: group.Stops,
      };

      navigation.navigate('Route', { coordinates });
    }

    return null;
  }

  onCloseNotification = () => {
    this.setState({ notification: false, notifierOffset: 0 });
  }

  onOffer = () => {
    const { navigation, group } = this.props;
    Keyboard.dismiss();
    navigation.navigate('Offer', { groupId: group.id });
  }

  onAsk = () => {
    const { navigation, group } = this.props;
    Keyboard.dismiss();
    navigation.navigate('Ask', { groupId: group.id });
  }

  onReport = () => {
    const { navigation, group } = this.props;
    this.setModalVisible(false);
    navigation.navigate('Report', { data: { Group: group }, type: FEEDABLE_GROUP });
  }

  setCalendarVisibilty = (show) => {
    this.setState({ showCalendar: show });
  }

  setModalVisible = (show) => {
    this.setState({ modalVisibility: show });
  }

  redirectToSelectedTripDate = (date) => {
    const { navigation, group } = this.props;
    this.setCalendarVisibilty(false);

    navigation.navigate('SharedTrip', { date, id: group.id });
  }

  leaveGroup = () => {
    const { leaveGroup, refresh, group } = this.props;

    this.setState({ leaveLoading: true });
    leaveGroup(group.id)
      .then(refresh)
      .catch(console.warn);
  }

  checkValidation = (comment) => {
    const errors = [];

    if (comment === '') {
      errors.push('Comment is required.');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  isGroupJoined = () => {
    const { user, group } = this.props;

    if (user.id === group.User.id) {
      return false;
    }

    return group.membershipStatus === 'accepted';
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  header = (leaveLoading) => {
    const { group } = this.props;

    return (
      <View>
        <GroupImage group={group} />
        {this.isGroupJoined() && this.renderLeaveButton(leaveLoading)}
        <MapToggle handlePress={this.onMapPress} />
      </View>);
  }

  renderLeaveButton = leaveLoading => (
    <View style={styles.leaveButton}>
      {
        leaveLoading ?
          <View style={styles.leaving}>
            <Text style={[styles.leaveText, styles.leavingText]}>Leaving</Text>
            <Loading />
          </View>
          :
          <TouchableWithoutFeedback
            onPress={this.leaveGroup}
          >
            <View><Text style={styles.leaveText}> Leave group </Text></View>
          </TouchableWithoutFeedback>
      }
    </View>
  );

  renderModal = () => {
    const { modalVisibility } = this.state;
    const { user, group } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ modalVisibility: false })}
        visible={modalVisibility}
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {
              user.id !== group.User.id &&
              <TouchableOpacity
                style={styles.action}
                onPress={this.onReport}
              >
                <Text style={styles.actionLabel}>{trans('group.report_this_group')}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => this.setModalVisible(!modalVisibility)}
            >
              <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderShareModal() {
    const { showShareModal, group } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={FEEDABLE_GROUP}
          detail={group}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderCalendarModal() {
    const { showCalendar } = this.state;
    const { group } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ showCalendar: false })}
        visible={showCalendar}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.75)' }}>
          <View style={styles.groupCalendarContent}>
            <Calendar id={group.id} handleDayPress={this.redirectToSelectedTripDate} />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => this.setCalendarVisibilty(false)}
              >
                <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { navigation, group } = this.props;
    const { leaveLoading, notification, notifierOffset, loading, error, success } = this.state;
    const header = this.header(leaveLoading);
    const { notifier, notificationMessage } = navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <Toast message={error} type="error" />
        <Toast message={success} type="success" />
        <FloatingNavbar handleBack={this.goBack} offset={notifierOffset} />
        {notification && <AppNotification
          image={notifier.avatar}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
        <GroupFeedList
          header={header}
          footer={<View style={{ marginTop: 100 }} />}
          id={group.id}
          isAdmin={group.isAdmin}
          type={FEEDABLE_GROUP}
          ownerId={group.User.id}
        />
        <CommentBox
          handleSend={this.onSubmit}
          loading={loading}
          hasCalender
          handleShowCalender={this.setCalendarVisibilty}
          onOffer={this.onOffer}
          onAsk={this.onAsk}
          handleShowOptions={() => this.setModalVisible(true)}
        />
        {this.renderModal()}
        {this.renderShareModal()}
        {this.renderCalendarModal()}
      </Wrapper>
    );
  }
}

Detail.propTypes = {
  leaveGroup: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    photo: PropTypes.string,
    membershipStatus: PropTypes.string,
    User: PropTypes.object.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withLeaveGroup,
  submitComment,
  withNavigation,
  connect(mapStateToProps),
)(Detail);
