import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Keyboard,
  Image,
  Text,
} from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
// import ToolBar from '@components/utils/toolbar';
import GroupToolbar from '@components/group/groupToolbar';
import actionSheetMenu from '@components/common/actionSheetMenu';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed, withGroupTrips, withGroupTripCalendar } from '@services/apollo/group';
import { withMute, withUnmute } from '@services/apollo/mute';
import { AppNotification, Wrapper, ActionModal, ModalAction } from '@components/common';
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
import LocationIcon from '@assets/icons/ic_location.png';

const GroupFeedList = withGroupFeed(GroupFeed);
const Calendar = withGroupTripCalendar(GroupCalendar);

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
    this.actionSheet = {};
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { notifier } = navigation.state.params;

    if (notifier) {
      this.setState({ notification: true, notifierOffset: 75 });
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
    this.actionSheet.hide();
    const { navigation, group } = this.props;
    setTimeout(() => {
      if (group.outreach === STRETCH_TYPE_AREA && group.areaCoordinates) {
        navigation.navigate('Area', { info: group, pressShareLocation });
      }

      if (group.outreach === STRETCH_TYPE_ROUTE) {
        navigation.navigate('Route', { info: group, pressShareLocation });
      }
    }, 200);
    // this.setState({ showAction: false });
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

  onShowShareModal = () => {
    this.actionSheet.hide();
    setTimeout(() => {
      this.setState({ showShareModal: true });
    }, 200);
  }

  onMute = (unit, type = null) => {
    this.actionSheet.hide();
    const { group, mute, refresh } = this.props;
    const data = {
      mutable: 'Group',
      mutableId: group.id,
    };
    setTimeout(() => {
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
    }, 200);
    // this.setState({ showAction: false });
  }

  onUnmute = () => {
    this.actionSheet.hide();
    const { group, refresh } = this.props;
    // this.setState({ showAction: false });
    setTimeout(() => {
      this.props.unmute({
        mutable: 'Group',
        mutableId: group.id,
      }).then(refresh);
    }, 200);
  }

  onGroupInformation = () => {
    this.actionSheet.hide();
    const { group, navigation } = this.props;
    // this.setState({ showAction: false });
    setTimeout(() => {
      navigation.navigate('GroupInformation', { group });
    }, 200);
  }

  onEmbedHtml = () => {
    this.actionSheet.hide();
    const { group, navigation } = this.props;
    // this.setState({ showAction: false });
    setTimeout(() => {
      navigation.navigate('EmbedGroup', { type: group.type, id: group.id });
    }, 200);
  }

  setCalendarVisibilty = (show) => {
    this.setState({ showCalendar: show });
  }

  redirectToSelectedTripDate = (date) => {
    const { navigation, group } = this.props;
    this.setCalendarVisibilty(false);

    navigation.navigate('SharedTrip', { date, id: group.id });
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
    const { showShareModal } = this.state;
    const { group } = this.props;

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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <View style={styles.groupCalendarContent}>
            <Calendar
              firstDay={1}
              id={group.id}
              handleDayPress={this.redirectToSelectedTripDate}
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

  // renderOptions = () => {
  //   const { group } = this.props;
  //   let actions = [];

  //   actions = actions.concat([
  //     <ModalAction label={trans('detail.group_information')} onPress={() => this.onGroupInformation()} key="group_information" />,
  //     <ModalAction label={trans('detail.share_this_group')} onPress={() => this.setState({ showShareModal: true, showAction: false })} key="share_group" />,
  //     <ModalAction label={trans('detail.share_your_location')} onPress={() => this.onMapPress(true)} key="share_your_location" icon={LocationIcon} />,
  //   ]);

  //   if (group.muted) {
  //     actions = actions.concat([<ModalAction label={trans('detail.unmute')} onPress={this.onUnmute} key="unmute" />]);
  //   } else {
  //     actions = actions.concat([
  //       <ModalAction label={trans('detail.mute_for_24_hours')} onPress={() => this.onMute(24, 'hours')} key="mute_24_hours" />,
  //       <ModalAction label={trans('detail.mute_1_week')} onPress={() => this.onMute(1, 'week')} key="mute_1_week" />,
  //       <ModalAction label={trans('detail.mute_forever')} onPress={() => this.onMute('forever')} key="mute_forever" />,
  //     ]);
  //   }
  //   actions = actions.concat([<ModalAction label={trans('detail.embed_with_html')} onPress={() => this.onEmbedHtml()} key="embed_with_html" />]);

  //   return actions;
  // };

  renderOptions = () => {
    const { group } = this.props;
    const unMute = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={this.onUnmute}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.unmute')}</Text>
      </TouchableOpacity>,
    ];
    const mute = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onMute(24, 'hours')}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.mute_for_24_hours')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onMute(1, 'week')}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.mute_1_week')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onMute('forever')}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.mute_forever')}</Text>
      </TouchableOpacity>,
    ];
    const muteOption = group.muted ? unMute : mute;
    const options = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onGroupInformation()}
        style={[actionSheetMenu.actionItem, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.group_information')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onShowShareModal()}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.share_this_group')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onMapPress(true)}
        style={[actionSheetMenu.actionItem, { flexDirection: 'row' }]}
      >
        <Image source={LocationIcon} style={actionSheetMenu.locationIcon} />
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.share_your_location')}</Text>
      </TouchableOpacity>,
      ...muteOption,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.onEmbedHtml()}
        style={[actionSheetMenu.actionItem, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('detail.embed_with_html')}</Text>
      </TouchableOpacity>,
      'Cancel',
    ];
    return options;
  }

  renderActionSheet = () => (
    <ActionSheet
      ref={(sheet) => { this.actionSheet = sheet; }}
      options={this.renderOptions()}
      cancelButtonIndex={this.renderOptions().length - 1}
      onPress={() => { }}
      styles={actionSheetMenu}
    />
  );

  // renderOptionsModal = () => (
  //   <ActionModal
  //     transparent
  //     visible={this.state.showAction}
  //     onRequestClose={() => this.setState({ showAction: false })}
  //   >
  //     {this.renderOptions()}
  //   </ActionModal>
  // );

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
        <GroupToolbar title={group.name} mapPress={this.onMapPress} transparent offset={notifierOffset} />
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
          handleShowOptions={() => this.actionSheet.show()}
          handleShowCalender={this.setCalendarVisibilty}
          onOffer={this.onOffer}
          onAsk={this.onAsk}
          onBlur={this.onCommentBoxBlur}
        />
        {this.renderShareModal()}
        {this.renderCalendarModal()}
        {this.renderActionSheet()}
        {
          this.state.showCalendar &&
          <Modal
            animationType="slide"
            transparent
            onRequestClose={() => this.setState({ showCalendar: false })}
            visible={this.state.showCalendar}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}>
              <View style={styles.groupCalendarContent}>
                <Calendar
                  firstDay={1}
                  id={group.id}
                  handleDayPress={this.redirectToSelectedTripDate}
                  theme={{
                    'stylesheet.day.period': {
                      base: {
                        width: 34,
                        height: 34,
                        alignItems: 'center',
                      },
                    } }}
                />
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
  submit: PropTypes.func.isRequired,
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    photo: PropTypes.string,
    membershipStatus: PropTypes.string,
    User: PropTypes.object.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  submitComment,
  withNavigation,
  withMute,
  withUnmute,
  connect(mapStateToProps),
)(Detail);
