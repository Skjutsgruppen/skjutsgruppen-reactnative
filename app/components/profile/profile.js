import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import PropTypes from 'prop-types';
import { Loading, Avatar, RoundedButton } from '@components/common';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ProfileAction from '@components/profile/profileAction';
import { withAddFriend, withAcceptFriendRequest, withRejectFriendRequest, withCancelFriendRequest } from '@services/apollo/friend';
import Icon from 'react-native-vector-icons/Ionicons';
import GardenActive from '@assets/icons/ic_garden_profile.png';
import GardenInactive from '@assets/icons/ic_garden_profile_gray.png';
import { trans } from '@lang/i18n';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import _isEqual from 'lodash/isEqual';
import FOF from '@components/relation/friendsOfFriend';

import {
  RELATIONSHIP_TYPE_FRIEND,
  RELATIONSHIP_TYPE_INCOMING,
  RELATIONSHIP_TYPE_OUTGOING,
  FEED_FILTER_OFFERED,
  FEED_FILTER_WANTED,
  REPORT_TYPE_USER,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import Date from '@components/date';
import { withMyExperiences } from '@services/apollo/experience';
import List from '@components/experience/myExperienceList';

const MyExperience = withMyExperiences(List);

const styles = StyleSheet.create({
  profilePic: {
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.black,
    marginBottom: 12,
    textAlign: 'center',
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    backgroundColor: Colors.background.red,
    borderRadius: 8,
  },
  actionButtonAccept: {
    backgroundColor: Colors.background.green,
  },
  actionLabel: {
    marginLeft: 6,
    color: Colors.text.white,
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
    }

    subscribeToUpdatedProfile({ id });
  }

  componentWillReceiveProps({ data }) {
    const { profile, loading, refetch } = data;
    const { setUser } = this.props;
    const { user } = this.state;

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
      navigation.navigate('UserConversation', { username: user.firstName });
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
      return this.renderAction();
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
      .then(() => this.setState({ loading: false, action: ACTION_ACCEPTED }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectRequest = () => {
    const { rejectFriendRequest } = this.props;
    const { user, refetch } = this.state;

    this.setState({ loading: true });
    rejectFriendRequest(user.friendRequestId, user.id, true)
      .then(refetch)
      .then(() => this.setState({ loading: false, action: ACTION_REJECTED }))
      .catch(() => this.setState({ loading: false }));
  }

  fbLink() {
    const { user } = this.state;

    if (user.fbId) {
      return (
        <ProfileAction
          onPress={() => Linking.openURL(`https://www.facebook.com/${user.fbId}`)}
          label="Facebook profile"
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
          label="Twitter profile"
        />
      );
    }

    return null;
  }

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

  renderAction = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        onPress={this.acceptRequest}
        style={[styles.actionButton, styles.actionButtonAccept]}
      >
        <Icon
          name="ios-checkmark"
          size={24}
          color={Colors.text.white}
        /><Text style={styles.actionLabel}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.rejectRequest}
        style={styles.actionButton}
      >
        <Icon
          name="ios-close"
          size={24}
          color={Colors.text.white}
        /><Text style={styles.actionLabel}>Reject</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { networkStatus, error, refetch } = this.props.data;
    const { user } = this.state;
    let errorMessage = null;

    if (error) {
      errorMessage = (
        <View style={{ marginTop: 100 }}>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
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

    return (
      <LinearGradient style={{ flex: 1 }} colors={Gradients.white}>
        {errorMessage}
        <Avatar
          notTouchable
          isSupporter={user.isSupporter}
          size={145}
          imageURI={user.avatar}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={[styles.lightText, styles.joinedDate]}>Joined <Date format="MMM Do YYYY">{user.createdAt}</Date></Text>
        <View style={styles.activityWrapper}>
          <View style={styles.hexagon}>
            <View style={styles.experienceCountWrapper}>
              {user.totalExperiences > 0 ? (
                <Image
                  source={require('@assets/icons/ic_camera_head.png')}
                  style={styles.sunRay}
                />
              ) : null}
              <Text
                style={[
                  styles.experienceCount,
                  { color: user.totalExperiences > 0 ? Colors.text.pink : Colors.text.gray },
                ]}
              >
                {user.totalExperiences}
              </Text>
            </View>
            <Text style={styles.activityLabel}>{user.totalExperiences <= 1 ? 'Experience' : 'Experiences'}</Text>
          </View>
          <View style={styles.hexagon}>
            <Image
              source={user.isSupporter ? GardenActive : GardenInactive}
              style={styles.garden}
            />
            <Text style={styles.activityLabel}>{user.isSupporter ? 'Supporter' : 'Not supporting'}</Text>
          </View>
        </View>
        {this.friendRelationButton()}
        {this.renderRelation()}
        {user.totalExperiences > 0 && <MyExperience id={user.id} />}
        <View style={styles.actionsWrapper}>
          {this.fbLink()}
          {this.twLink()}
          <ProfileAction
            label={`${user.totalOffered || 0} offered ${(user.totalOffered || 0) <= 1 ? 'ride' : 'rides'}`}
            onPress={() => this.redirect(FEED_FILTER_OFFERED)}
          />
          <ProfileAction
            label={`${user.totalAsked || 0} ${(user.totalAsked || 0) <= 1 ? 'ride' : 'rides'} asked for`}
            onPress={() => this.redirect(FEED_FILTER_WANTED)}
          />
          <ProfileAction
            label={`${user.totalRideConversations || 0} ride ${(user.totalRideConversations || 0) <= 1 ? 'conversation' : 'conversations'}`}
            onPress={() => this.redirect('conversation')}
          />
          <ProfileAction
            label={`${user.totalGroups || 0} ${(user.totalGroups || 0) <= 1 ? 'group' : 'groups'}`}
            onPress={() => this.redirect('groups')}
          />
          <ProfileAction
            label={`${user.totalFriends || 0} ${(user.totalFriends || 0) <= 1 ? 'friend' : 'friends'}`}
            onPress={() => this.redirect('friends')}
          />
          <ProfileAction
            title={`Participant number ${user.id}`}
            label=""
          />
          {!this.isCurrentUser() &&
            <ProfileAction
              label="Report user"
              onPress={() => this.redirect(REPORT_TYPE_USER)}
            />
          }
        </View>
      </LinearGradient>
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
};

Profile.defaultProps = {
  id: null,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
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
