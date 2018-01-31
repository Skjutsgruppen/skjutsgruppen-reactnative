import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed } from '@services/apollo/group';
import { withLeaveGroup } from '@services/apollo/notification';
import { withShare } from '@services/apollo/share';
import { AppNotification, Wrapper, Loading, FloatingNavbar, CommentBox } from '@components/common';
import Colors from '@theme/colors';
import GroupFeed from '@components/group/feed/list';
import GroupImage from '@components/group/groupImage';
import Share from '@components/common/share';
import { FEEDABLE_GROUP } from '@config/constant';
import MapToggle from '@components/group/mapToggle';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { withNavigation } from 'react-navigation';

const GroupFeedList = withGroupFeed(GroupFeed);

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
      isOpen: false,
      notification: false,
      notifierOffset: 0,
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

  onSharePress = () => {
    this.setState({ isOpen: true });
  }

  onShare = (shareObject) => {
    const { share, group } = this.props;
    share({ id: group.id, type: FEEDABLE_GROUP, share: shareObject })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
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
    const coordinates = {
      start: group.TripStart,
      end: group.TripEnd,
      stops: group.Stops,
    };

    navigation.navigate('Route', { coordinates });
  }

  onCloseNotification = () => {
    this.setState({ notification: false, notifierOffset: 0 });
  }

  leaveGroup = () => {
    const { leaveGroup, refresh, group } = this.props;

    this.setState({ leaveLoading: true }, () => leaveGroup(group.id)
      .then(refresh)
      .catch(console.warn),
    );
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

  render() {
    const { navigation, group } = this.props;
    const { leaveLoading, notification, notifierOffset, loading, error, success } = this.state;
    const header = this.header(leaveLoading);
    const { notifier, notificationMessage } = navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <FloatingNavbar handleBack={this.goBack} offset={notifierOffset} />
        {notification && <AppNotification
          image={notifier.avatar}
          name={notifier.firstName}
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
        <GroupFeedList
          header={header}
          groupId={group.id}
        />
        <Toast message={error} type="error" />
        <Toast message={success} type="success" />
        <CommentBox
          handleSend={this.onSubmit}
          loading={loading}
          hasCalender
        />
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

Detail.propTypes = {
  share: PropTypes.func.isRequired,
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
  withShare,
  withLeaveGroup,
  submitComment,
  withNavigation,
  connect(mapStateToProps),
)(Detail);
