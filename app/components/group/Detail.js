import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ToolBar from '@components/utils/toolbar';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed, withGroupTrips } from '@services/apollo/group';
import { withLeaveGroup } from '@services/apollo/notification';
import { withMute, withUnmute } from '@services/apollo/mute';
import { AppNotification, Wrapper, ConfirmModal, ActionModal, ModalAction } from '@components/common';
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
import { getDate } from '@config';
import CommentBox from '@components/group/commentBox';
import { AppText } from '@components/utils/texts';

const GroupFeedList = withGroupFeed(GroupFeed);
const Calendar = withGroupTrips(GroupCalendar);

const styles = StyleSheet.create({
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
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
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
      showAction: false,
      notification: false,
      notifierOffset: 0,
      showCalendar: false,
      groupTrips: [],
      confirmModal: false,
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

  onMapPress = (pressShareLocation) => {
    const { navigation, group } = this.props;

    if (group.outreach === STRETCH_TYPE_AREA && group.areaCoordinates) {
      navigation.navigate('Area', { info: group, pressShareLocation });
    }

    if (group.outreach === STRETCH_TYPE_ROUTE) {
      navigation.navigate('Route', { info: group, pressShareLocation });
    }

    this.setState({ showAction: false });

    return null;
  }

  onCloseNotification = () => {
    this.setState({ notification: false, notifierOffset: 0 });
  }

  onCommentBoxBlur = comment => this.setState({ comment });

  onOffer = (comment) => {
    const { navigation, group } = this.props;
    Keyboard.dismiss();
    navigation.navigate('Offer', { group, description: comment });
  }

  onAsk = (comment) => {
    const { navigation, group } = this.props;
    Keyboard.dismiss();
    navigation.navigate('Ask', { group, description: comment });
  }

  onReport = () => {
    const { navigation, group } = this.props;
    this.setState({ showAction: false });
    navigation.navigate('Report', { data: { Group: group }, type: FEEDABLE_GROUP });
  }

  onMute = (unit, type = null) => {
    const { group, mute, refresh } = this.props;
    const data = {
      mutable: 'Group',
      mutableId: group.id,
    };

    this.setState({ showAction: false });

    if (unit === 'forever') {
      data.forever = true;
    } else {
      const date = getDate();
      const from = date.format();
      const to = date.add(unit, type).format();
      data.from = from;
      data.to = to;
    }
    mute(data).then(refresh);
  }

  onUnmute = () => {
    const { group, refresh } = this.props;
    this.setState({ showAction: false });
    this.props.unmute({
      mutable: 'Group',
      mutableId: group.id,
    }).then(refresh);
  }

  onGroupInformation = () => {
    const { group, navigation } = this.props;
    this.setState({ showAction: false });
    navigation.navigate('GroupInformation', { group });
  }

  setCalendarVisibilty = (show) => {
    this.setState({ showCalendar: show });
  }

  setConfirmModalVisibility = (show) => {
    this.setState({ showConfirmModal: show });
  }

  redirectToSelectedTripDate = (date) => {
    const { navigation, group } = this.props;
    this.setCalendarVisibilty(false);

    navigation.navigate('SharedTrip', { date, id: group.id });
  }

  leaveGroup = () => {
    const { group } = this.props;

    this.setState({ leaveLoading: true });
    this.setState({ showConfirmModal: false }, () => this.props.leaveGroup(group.id));
  }

  checkValidation = (comment) => {
    const errors = [];

    if (comment === '') {
      errors.push(trans('detail.comment_is_required'));
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  isGroupJoined = () => {
    const { group } = this.props;

    return group.membershipStatus === 'accepted';
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  header = () => {
    const { group } = this.props;

    return (
      <View>
        <GroupImage group={group} />
        <MapToggle handlePress={() => this.onMapPress()} />
      </View>);
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
                <AppText centered fontVariation="bold" color={Colors.text.blue}>{trans('global.cancel')}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderOptions = () => {
    const { group, user } = this.props;
    let actions = [];

    actions = actions.concat([
      <ModalAction label={trans('detail.group_information')} onPress={() => this.onGroupInformation()} key="group_information" />,
      <ModalAction label={trans('detail.share_your_location')} onPress={() => this.onMapPress(true)} key="share_your_location" />,
    ]);

    if (group.muted) {
      actions = actions.concat([<ModalAction label={trans('detail.unmute')} onPress={this.onUnmute} key="unmute" />]);
    } else {
      actions = actions.concat([
        <ModalAction label={trans('detail.mute_for_24_hours')} onPress={() => this.onMute(24, 'hours')} key="mute_24_hours" />,
        <ModalAction label={trans('detail.mute_1_week')} onPress={() => this.onMute(1, 'week')} key="mute_1_week" />,
        <ModalAction label={trans('detail.mute_forever')} onPress={() => this.onMute('forever')} key="mute_forever" />,
      ]);
    }

    if (this.isGroupJoined()) {
      actions = actions.concat([
        <ModalAction label={trans('detail.leave_group')} onPress={() => this.setConfirmModalVisibility(true)} key="leave" />,
      ]);
    }

    if (user.id !== group.User.id) {
      actions = actions.concat([
        <ModalAction label={trans('detail.report_this_group')} onPress={this.onReport} key="report" />,
      ]);
    }

    return actions;
  };

  renderOptionsModal = () => (
    <ActionModal
      transparent
      visible={this.state.showAction}
      onRequestClose={() => this.setState({ showAction: false })}
    >
      {this.renderOptions()}
    </ActionModal>
  );

  renderConfirmModal = () => {
    const { leaveLoading, showConfirmModal } = this.state;
    const message = (
      <AppText>{trans('detail.are_you_sure_you_want_to_leave_group')}</AppText>
    );

    return (
      <ConfirmModal
        loading={leaveLoading}
        visible={showConfirmModal}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={() => this.leaveGroup()}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  render() {
    const { navigation, group } = this.props;
    const { notification, notifierOffset, loading, error, success } = this.state;
    const header = this.header();
    const { notifier, notificationMessage } = navigation.state.params;

    if (group.isDeleted) {
      return null;
    }

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <ToolBar transparent offset={notifierOffset} />
        {notification && <AppNotification
          image={notifier.avatar}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
        <Toast message={error} type="error" />
        <Toast message={success} type="success" />
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
          handleShowOptions={() => this.setState({ showAction: true })}
          handleShowCalender={this.setCalendarVisibilty}
          onOffer={this.onOffer}
          onAsk={this.onAsk}
          onBlur={this.onCommentBoxBlur}
        />
        {this.renderShareModal()}
        {this.renderCalendarModal()}
        {this.renderOptionsModal()}
        {this.renderConfirmModal()}
        {
          this.state.showCalendar &&
          <Modal
            animationType="slide"
            transparent
            onRequestClose={() => this.setState({ showCalendar: false })}
            visible={this.state.showCalendar}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.75)' }}>
              <View style={styles.groupCalendarContent}>
                <Calendar id={group.id} handleDayPress={this.redirectToSelectedTripDate} />
                <View style={styles.closeWrapper}>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={() => this.setCalendarVisibilty(false)}
                  >
                    <AppText centered fontVariation="bold" color={Colors.text.blue}>{trans('global.cancel')}</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        }
      </Wrapper>
    );
  }
}

Detail.propTypes = {
  leaveGroup: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
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
  withMute,
  withUnmute,
  connect(mapStateToProps),
)(Detail);
