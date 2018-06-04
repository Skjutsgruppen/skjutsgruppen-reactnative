import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Modal, Platform, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import Toolbar from '@components/utils/toolbar';
import { ShareButton, RoundedButton, ConfirmModal } from '@components/common';
import GroupMap from '@components/group/groupMap';
import MembershipRequest from '@components/group/membershipRequest/membershipRequestAvatar';
import ParticipantAvatar from '@components/group/participantAvatar';
import { withGroupMembers, withGroupMembershipRequest, withGroup } from '@services/apollo/group';
import { OPEN_GROUP, CLOSE_GROUP, STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE, FEEDABLE_GROUP } from '@config/constant';
import Share from '@components/common/share';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';
import { withLeaveGroup } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.background.mutedBlue,
  },
  footer: {
    padding: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 15,
      },
    }),
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  aboutTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 50,
  },
  action: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

const ParticipantListBubble = withGroupMembers(ParticipantAvatar);
const MembershipRequestBubble = withGroupMembershipRequest(MembershipRequest);
const Enablers = withGroupMembers(ParticipantAvatar);

class Information extends Component {
  constructor(props) {
    super(props);
    this.state = { showShareModal: false, group: {}, showConfirmModal: false, leaveLoading: false };
  }

  componentWillMount() {
    const { navigation, subscribeToGroup } = this.props;
    const { group } = navigation.state.params;
    this.setState({ group });

    subscribeToGroup(group.id);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillReceiveProps({ group }) {
    this.setState({ group });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation } = this.props;
    navigation.goBack();

    return true;
  }

  onPress = (type) => {
    const { navigation } = this.props;
    const { group } = navigation.state.params;

    if (type === 'EnablerList') {
      navigation.navigate('EnablerList', { group });
    }

    if (type === 'MembershipRequest') {
      navigation.navigate('MembershipRequest', { id: group.id });
    }

    if (type === 'Participants') {
      navigation.navigate('Participants', { group });
    }

    if (type === 'EditGroup') {
      navigation.navigate('EditGroup', { id: group.id });
    }
  }

  onReport = () => {
    const { navigation, group } = this.props;
    this.setState({ showAction: false });
    navigation.navigate('Report', { data: { Group: group }, type: FEEDABLE_GROUP });
  }

  setConfirmModalVisibility = (show) => {
    this.setState({ showConfirmModal: show });
  }

  leaveGroup = () => {
    const { group, navigation } = this.props;

    this.setState({ leaveLoading: true });
    this.setState({ showConfirmModal: false }, () => {
      this.props.leaveGroup(group.id).then(() => { navigation.goBack(); });
    });
  }

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

  renderShareButton = () => (
    <ShareButton
      onPress={() => this.setState({ showShareModal: true })}
      animated={false}
    />
  );

  renderButton = () => (
    <RoundedButton
      onPress={() => this.onPress('EditGroup')}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      {trans('global.change')}
    </RoundedButton>
  );

  renderShareModal = () => {
    const { navigation } = this.props;
    const { group } = navigation.state.params;

    return (
      <Modal
        visible={this.state.showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={'Group'}
          detail={group}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderStops = (Stops) => {
    let stopText = `${trans('detail.stops_in')} `;

    Stops.forEach((stop, index) => {
      if (index > 0) {
        stopText += ', ';
      }
      stopText += stop.name;
    });

    return stopText;
  }

  renderDetails = () => {
    const { group } = this.state;
    const { user } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Toolbar
          title={group.name}
          transparent={false}
          right={this.renderShareButton}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: Colors.background.mutedBlue }}
        >
          <View style={{ backgroundColor: Colors.background.fullWhite, marginBottom: 80 }}>
            {group.mapPhoto &&
              <GroupMap
                group={group}
                onMapPress={() => { }}
                showOverlay={false}
              />
            }
            <View style={{ height: 12 }} />
            <ParticipantListBubble
              id={group.id}
              offset={0}
              onPress={this.onPress}
              displayCount
              enabler={false}
            />
            {group.isAdmin &&
              <MembershipRequestBubble
                id={group.id}
                onPress={this.onPress}
              />
            }
            <Enablers
              id={group.id}
              onPress={this.onPress}
              offset={0}
              enabler
            />
            <View style={{ backgroundColor: '#fff' }}>
              <AppText size={12} color={Colors.text.blue} style={styles.aboutTitle}>{trans('global.about')}</AppText>
              <AppText style={styles.text}>
                {group.type === OPEN_GROUP && trans('detail.open_group')}
                {group.type === CLOSE_GROUP && trans('detail.closed_group')}
              </AppText>
              <AppText style={styles.text}>
                {group.outreach === STRETCH_TYPE_AREA && [group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                {group.outreach === STRETCH_TYPE_ROUTE && `${group.TripStart.name || group.direction} - ${group.TripEnd.name || group.direction}`}
              </AppText>
              <AppText style={styles.text}>
                {group.outreach === STRETCH_TYPE_ROUTE
                  && group.Stops.length > 0
                  && this.renderStops(group.Stops)}
              </AppText>
              <AppText style={styles.description}>
                {group.description}
              </AppText>
              {
                group.membershipStatus === 'accepted' &&
                <TouchableHighlight
                  onPress={() => this.setConfirmModalVisibility(true)}
                  style={styles.action}
                >
                  <AppText
                    color={Colors.text.blue}
                  >
                    {trans('detail.leave_group')}
                  </AppText>
                </TouchableHighlight>
              }
              {
                group.User.id !== user.id &&
                <TouchableHighlight
                  onPress={() => this.setConfirmModalVisibility(true)}
                  style={styles.action}
                >
                  <AppText
                    color={Colors.text.blue}
                  >
                    {trans('detail.report_this_group')}
                  </AppText>
                </TouchableHighlight>
              }

            </View>
            {this.renderShareModal()}
            {this.renderConfirmModal()}
          </View>
        </ScrollView>
      </View>
    );
  }

  render() {
    const { group } = this.state;

    return (
      <View style={styles.contentWrapper}>
        {!group.isDeleted && this.renderDetails()}
        {group.isAdmin &&
          <View style={styles.footer}>
            {this.renderButton()}
          </View>
        }
      </View>
    );
  }
}

Information.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  subscribeToGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const GroupInfo = compose(withGroup, withLeaveGroup, connect(mapStateToProps))(Information);

const GroupInformation = ({ navigation }) => {
  if (!navigation.state.params) {
    return null;
  }

  const { group } = navigation.state.params;

  return <GroupInfo navigation={navigation} id={group.id} />;
};

GroupInformation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

GroupInformation.navigationOptions = {
  header: null,
};

export default GroupInformation;
