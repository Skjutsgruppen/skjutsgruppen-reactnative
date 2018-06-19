import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import PropTypes from 'prop-types';
import { Container, Loading, Avatar, RoundedButton } from '@components/common';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ProfileAction from '@components/profile/profileAction';
import { withAddFriend, withAcceptFriendRequest, withRejectFriendRequest, withCancelFriendRequest } from '@services/apollo/friend';
import GardenActive from '@assets/icons/ic_garden_profile.png';
import GardenInactive from '@assets/icons/ic_garden_profile_gray.png';
import { trans } from '@lang/i18n';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import _isEqual from 'lodash/isEqual';
import FOF from '@components/relation/friendsOfFriend';
import { Heading, AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import ToolBar from '@components/utils/toolbar';

import {
  RELATIONSHIP_TYPE_FRIEND,
  RELATIONSHIP_TYPE_INCOMING,
  RELATIONSHIP_TYPE_OUTGOING,
  FEED_FILTER_OFFERED,
  FEED_FILTER_WANTED,
  REPORT_TYPE_USER,
  NOT_AUTHORIZED_ERROR,
  JWT_MALFORMED_ERROR,
} from '@config/constant';
import { withNavigation, NavigationActions } from 'react-navigation';
import Date from '@components/date';
import { withMyExperiences } from '@services/apollo/experience';
import List from '@components/experience/myExperienceList';
import AcceptIcon from '@assets/icons/ic_accept.png';
import RejectIcon from '@assets/icons/ic_reject.png';
import BackIcon from '@assets/icons/ic_back_toolbar.png';
import { getProfile, resetLocalStorage } from '@services/apollo/dataSync';
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';

const MyExperience = withMyExperiences(List);

const styles = StyleSheet.create({
  changeButton: {
    height: 30,
    minWidth: 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.pink,
    borderRadius: 15,
    paddingHorizontal: 12,
  },
  whiteText: {
    color: Colors.text.white,
    backgroundColor: 'transparent',
  },
  backIconWrapper: {
    height: 48,
    width: 48,
    marginTop: 20,
    marginBottom: 4,
    borderRadius: 24,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  circularTouchable: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  backbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 2,
  },
  backIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  relationActions: {
    paddingHorizontal: 20,
    backgroundColor: Colors.background.fullWhite,
    elevation: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
    zIndex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 12,
  },
  actionLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: Colors.text.blue,
  },
  profilePic: {
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  name: {
    marginBottom: 12,
  },
  joinedDate: {
    textAlign: 'center',
  },
  activityWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  hexagon: {
    height: 90,
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  experienceCountWrapper: {
    alignItems: 'center',
  },
  sunRay: {
    height: 22,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  experienceCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.pink,
  },
  activityLabel: {
    fontSize: 14,
    color: Colors.text.darkGray,
    textAlign: 'center',
    marginVertical: 8,
  },
  lightText: {
    color: Colors.text.gray,
  },
  connection: {
    marginTop: 12,
  },
  button: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 48,
    width: '75%',
  },
  verticalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginHorizontal: 20,
  },
  actionButtonAccept: {
    backgroundColor: Colors.background.green,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
  actionsWrapper: {
    marginTop: 24,
  },
});

const ACTION_NONE = 0;
const ACTION_ACCEPTED = 1;
const ACTION_REJECTED = 2;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      isRequestPending: false,
      action: ACTION_NONE,
      user: {},
      loading: false,
      refetch: null,
    });
  }

  componentWillMount() {
    const { subscribeToUpdatedProfile, id } = this.props;

    if (this.isCurrentUser()) {
      const { user } = this.props;
      this.setState({ user });
    } else {
      const profile = getProfile(id);
      this.setState({ user: profile });
    }

    subscribeToUpdatedProfile({ id });
  }

  async componentWillReceiveProps({ data }) {
    const { profile, loading, refetch, error } = data;
    const { setUser, logout } = this.props;
    const { user } = this.state;

    if (!loading && error) {
      const { graphQLErrors } = error;
      if (graphQLErrors && graphQLErrors.length > 0) {
        const notAuthroized = graphQLErrors.filter(gError =>
          (gError.code === NOT_AUTHORIZED_ERROR || gError.code === JWT_MALFORMED_ERROR));
        if (notAuthroized.length > 0) {
          await firebase.notifications().cancelAllNotifications();
          logout()
            .then(() => LoginManager.logOut())
            .then(() => this.reset())
            .catch(() => this.reset());
        }
      }
    }

    if (!loading && profile.id) {
      const { __typename } = profile;
      if (this.isCurrentUser() && __typename === 'Account' && !_isEqual(profile, user)) {
        setUser(profile);
      }

      this.setState({ user: profile, loading, refetch });
    }
  }

  onPressProfile = (id) => {
    const { navigation } = this.props;

    navigation.navigate('Profile', { profileId: id });
  }

  getPrefix = () => {
    const { user } = this.state;

    return this.isCurrentUser() ? 'My' : `${user.firstName}'s`;
  }

  reset = async () => {
    const { navigation } = this.props;
    await resetLocalStorage();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });
    navigation.dispatch(resetAction);
  }

  redirect = (type) => {
    const { user } = this.state;
    const { navigation, id } = this.props;

    if (type === 'groups') {
      navigation.navigate('UserGroups', { userId: id, username: user.firstName });
    }

    if (type === 'friends') {
      navigation.navigate('UserFriends', { id, username: user.firstName });
    }

    if (type === FEED_FILTER_WANTED) {
      navigation.navigate('UserTrips', { userId: id, type: FEED_FILTER_WANTED, username: user.firstName });
    }

    if (type === FEED_FILTER_OFFERED) {
      navigation.navigate('UserTrips', { userId: id, type: FEED_FILTER_OFFERED, username: user.firstName });
    }

    if (type === 'experiences') {
      navigation.navigate('UserExperiences', { userId: id });
    }

    if (type === 'conversation') {
      navigation.navigate('UserConversation', { username: user.firstName, userId: id });
    }

    if (type === REPORT_TYPE_USER) {
      navigation.navigate('Report', { data: { User: user }, type: REPORT_TYPE_USER });
    }
  }

  sendRequest = () => {
    const { user } = this.state;
    this.setState({ loading: true }, () => {
      this.props.addFriend(user.id)
        .then(this.state.refetch)
        .then(() => this.setState({ isRequestPending: true, loading: false }))
        .catch(() => this.setState({ loading: false }));
    });
  }

  cancelRequest = () => {
    const { user, refetch } = this.state;

    this.setState({ loading: true }, () => {
      this.props.cancelFriendRequest(user.friendRequestId, user.id, true)
        .then(refetch)
        .then(() => this.setState({ isRequestPending: false, loading: false }))
        .catch(() => this.setState({ loading: false }));
    });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  isCurrentUser = () => {
    const { id, user } = this.props;

    return user.id === id;
  }

  friendRelationButton = () => {
    const { user, loading } = this.state;

    if (this.isCurrentUser()) {
      return null;
    }

    if (loading) {
      return (<Loading />);
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_FRIEND) {
      return null;
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_INCOMING) {
      return null;
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_OUTGOING) {
      return (
        <RoundedButton
          style={styles.button}
          bgColor={Colors.background.red}
          onPress={this.cancelRequest}
        >
          Cancel friend request
        </RoundedButton>
      );
    }

    return (
      <RoundedButton
        style={styles.button}
        bgColor={Colors.background.pink}
        onPress={this.sendRequest}
      >
        Friend request
      </RoundedButton>
    );
  }

  acceptRequest = () => {
    const { acceptFriendRequest } = this.props;
    const { user, refetch } = this.state;
    const currentUser = this.props.user;

    this.setState({ loading: true });
    acceptFriendRequest(user.friendRequestId, currentUser.id, user.id, true)
      .then(refetch)
      .then(() => this.setState({ action: ACTION_ACCEPTED }))
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectRequest = () => {
    const { rejectFriendRequest } = this.props;
    const { user, refetch } = this.state;

    this.setState({ loading: true });
    rejectFriendRequest(user.friendRequestId, user.id, true)
      .then(refetch)
      .then(() => this.setState({ action: ACTION_REJECTED }))
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  fbLink() {
    const { user } = this.state;

    if (user.fbId) {
      return (
        <ProfileAction
          onPress={() => Linking.openURL(`https://www.facebook.com/${user.fbId}`)}
          label={trans('profile.facebook_profile')}
        />
      );
    }

    return null;
  }

  twLink() {
    const { user } = this.state;

    if (user.twitterId) {
      return (
        <ProfileAction
          onPress={() => Linking.openURL(`https://twitter.com?profile_id=${user.twitterId}`)}
          label={trans('profile.twitter_profile')}
        />
      );
    }

    return null;
  }

  isCurrentUser = () => {
    const { id, user } = this.props;

    return user.id === id;
  }

  rightComponent = () => {
    const { navigation } = this.props;
    if (this.isCurrentUser()) {
      return (
        <TouchableOpacity style={styles.changeButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.whiteText}>{trans('profile.CHANGE')}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  renderRelation = () => {
    const { user } = this.state;
    if (!this.isCurrentUser() && user.relation) {
      return (
        <View style={styles.connection}>
          <View style={styles.verticalDivider} />
          <FOF relation={user.relation} viewee={user} />
        </View>
      );
    }

    return null;
  }

  renderFriendRequestAction = () => {
    const { firstName } = this.state.user;
    return (
      <View style={styles.relationActions}>
        <View style={styles.backIconWrapper}>
          <View style={styles.circularTouchable}>
            <TouchableHighlight onPress={this.goBack} style={styles.backbutton}>
              <View style={styles.backIcon}>
                <Image source={BackIcon} />
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <AppText centered fontVariation="semibold" color={Colors.text.darkGray}>{firstName}</AppText>
          <AppText centered fontVariation="semibold" color={Colors.text.darkGray}>
            {trans('profile.asks_to_be_your_friend')}
          </AppText>
        </View>
        {this.state.loading ? <Loading style={{ marginVertical: 20 }} /> : (
          <View style={styles.actions}>
            <TouchableHighlight
              onPress={this.acceptRequest}
              style={styles.actionButtonWrapper}
            >
              <View style={styles.actionButton}>
                <Image source={AcceptIcon} />
                <Text style={[styles.actionLabel, styles.bold]}>{trans('profile.accept')}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.rejectRequest}
              style={styles.actionButtonWrapper}
            >
              <View style={styles.actionButton}>
                <Image source={RejectIcon} />
                <Text style={[styles.actionLabel, styles.bold]}>{trans('profile.reject')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }

  render() {
    const { networkStatus, error, refetch } = this.props.data;
    const { user } = this.state;
    let errorMessage = null;

    if (error) {
      errorMessage = (
        <View style={{ marginTop: 100 }}>
          <AppText style={styles.errorText}>{trans('global.oops_something_went_wrong')}</AppText>
          <TouchableOpacity onPress={() => refetch()}>
            <AppText style={styles.errorText}>{trans('global.tap_to_retry')}</AppText>
          </TouchableOpacity>
        </View>
      );
    }

    if (!user.id && (networkStatus === 1 || networkStatus === 7)) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading />
        </View>
      );
    }

    const hasPendingFriendRequest = (user.relationshipType === RELATIONSHIP_TYPE_INCOMING)
      && !this.isCurrentUser();
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
        {!hasPendingFriendRequest && (
          <ToolBar
            transparent
            right={this.isCurrentUser() ? this.rightComponent : null}
          />
        )}
        {hasPendingFriendRequest && this.renderFriendRequestAction()}
        <Container>
          <LinearGradient style={{ flex: 1 }} colors={Gradients.white}>
            {errorMessage}
            <Avatar
              notTouchable
              isSupporter={user.isSupporter}
              size={145}
              imageURI={user.avatar}
              style={styles.profilePic}
            />
            <Heading fontVariation="bold" centered style={styles.name}>{user.firstName} {user.lastName}</Heading>
            <AppText style={[styles.lightText, styles.joinedDate]}>{trans('profile.joined')} <Date format="MMM Do YYYY">{user.createdAt}</Date></AppText>
            <View style={styles.activityWrapper}>
              <View style={styles.hexagon}>
                <View style={styles.experienceCountWrapper}>
                  {user.totalExperiences > 0 ? (
                    <Image
                      source={require('@assets/icons/ic_camera_head.png')}
                      style={styles.sunRay}
                    />
                  ) : null}
                  <AppText
                    style={[
                      styles.experienceCount,
                      { color: user.totalExperiences > 0 ? Colors.text.pink : Colors.text.gray },
                    ]}
                  >
                    {user.totalExperiences}
                  </AppText>
                </View>
                <AppText style={styles.activityLabel}>{user.totalExperiences <= 1 ? trans('profile.Experience') : trans('profile.Experiences')}</AppText>
              </View>
              <View style={styles.hexagon}>
                <Image
                  source={user.isSupporter ? GardenActive : GardenInactive}
                  style={styles.garden}
                />
                <AppText style={styles.activityLabel}>{user.isSupporter ? trans('profile.Supporter') : trans('profile.not_supporting')}</AppText>
              </View>
            </View>
            {this.friendRelationButton()}
            {this.renderRelation()}
            {user.totalExperiences > 0 && <MyExperience id={user.id} />}
            <View style={styles.actionsWrapper}>
              {this.fbLink()}
              {this.twLink()}
              <ProfileAction
                label={`${user.totalOffered || 0} ${trans('profile.offered')} ${(user.totalOffered || 0) <= 1 ? trans('global.ride') : trans('global.rides')}`}
                onPress={() => this.redirect(FEED_FILTER_OFFERED)}
              />
              <ProfileAction
                label={`${user.totalAsked || 0} ${(user.totalAsked || 0) <= 1 ? trans('global.ride') : trans('global.rides')} ${trans('profile.asked_for')}`}
                onPress={() => this.redirect(FEED_FILTER_WANTED)}
              />
              <ProfileAction
                label={`${user.totalRideConversations || 0} ${trans('global.ride')} ${(user.totalRideConversations || 0) <= 1 ? trans('global.conversation') : trans('global.conversations')}`}
                onPress={() => this.redirect('conversation')}
              />
              <ProfileAction
                label={`${user.totalGroups || 0} ${(user.totalGroups || 0) <= 1 ? trans('global.group') : trans('global.groups')}`}
                onPress={() => this.redirect('groups')}
              />
              <ProfileAction
                label={`${user.totalFriends || 0} ${(user.totalFriends || 0) <= 1 ? trans('global.friend') : trans('global.friends')}`}
                onPress={() => this.redirect('friends')}
              />
              <ProfileAction
                title={trans('profile.participant_number_value', { value: user.id })}
                label=""
              />
              {!this.isCurrentUser() &&
                <ProfileAction
                  label={trans('profile.report_user')}
                  onPress={() => this.redirect(REPORT_TYPE_USER)}
                />
              }
            </View>
          </LinearGradient>
        </Container>
      </View>
    );
  }
}

Profile.propTypes = {
  id: PropTypes.number,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    networkStatus: PropTypes.number.isRequired,
    refetch: PropTypes.func.isRequired,
    error: PropTypes.object,
  }).isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  addFriend: PropTypes.func.isRequired,
  cancelFriendRequest: PropTypes.func.isRequired,
  rejectFriendRequest: PropTypes.func.isRequired,
  acceptFriendRequest: PropTypes.func.isRequired,
  subscribeToUpdatedProfile: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  id: null,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(
  withAddFriend,
  withCancelFriendRequest,
  withAcceptFriendRequest,
  withRejectFriendRequest,
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps),
)(Profile);
