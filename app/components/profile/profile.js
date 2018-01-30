import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import PropTypes from 'prop-types';
import { Loading, Avatar } from '@components/common';
import CustomButton from '@components/common/customButton';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Relation from '@components/relation';
import ProfileAction from '@components/profile/profileAction';
import { withAddFriend, withAcceptFriendRequest, withRejectFriendRequest, withCancelFriendRequest } from '@services/apollo/friend';
import Icon from 'react-native-vector-icons/Ionicons';
import GardenActive from '@assets/icons/ic_garden_profile.png';
import GardenInactive from '@assets/icons/ic_garden_profile_gray.png';
import { trans } from '@lang/i18n';

import {
  RELATIONSHIP_TYPE_FRIEND,
  RELATIONSHIP_TYPE_INCOMING,
  RELATIONSHIP_TYPE_OUTGOING,
  FEED_FILTER_OFFERED,
  FEED_FILTER_WANTED,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import Date from '@components/date';

const styles = StyleSheet.create({
  profilePic: {
    alignSelf: 'center',
    marginTop: 54,
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
  activity: {
    alignItems: 'center',
  },
  hexagon: {
    height: 90,
    width: 90,
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
    color: Colors.text.darkGray,
    textAlign: 'center',
    marginVertical: 8,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.green,
    marginVertical: 6,
  },
  connectionLabel: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  lightText: {
    color: Colors.text.gray,
  },
  chevronDown: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 6,
    marginTop: 2,
  },
  connection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  connectionPic: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  withArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionArrow: {
    height: 12,
    width: 12,
    marginHorizontal: 2,
  },
  button: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 48,
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
  actionLable: {
    marginLeft: 6,
    color: Colors.text.white,
  },
  listWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  lastListWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  listLabel: {
    color: Colors.text.darkGray,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  disabledBtn: {
    margin: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
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
    if (this.isCurrentUser()) {
      const { user } = this.props;
      this.setState({ user });
    }
  }

  componentWillReceiveProps({ data }) {
    const { profile, loading, refetch } = data;
    if (!loading && profile.id) {
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
    const { navigation, id } = this.props;

    if (type === 'groups') {
      navigation.navigate('UserGroups', { userId: id });
    }

    if (type === 'friends') {
      navigation.navigate('UserFriends', { id });
    }

    if (type === FEED_FILTER_WANTED) {
      navigation.navigate('UserTrips', { userId: id, type: FEED_FILTER_WANTED });
    }

    if (type === FEED_FILTER_OFFERED) {
      navigation.navigate('UserTrips', { userId: id, type: FEED_FILTER_OFFERED });
    }

    if (type === 'experiences') {
      navigation.navigate('UserExperiences', { userId: id });
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

  friendRelationButtion = () => {
    const { user, loading } = this.state;

    if (this.isCurrentUser()) {
      return null;
    }

    if (loading) {
      return (<Loading />);
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_FRIEND) {
      return (
        <View style={styles.disabledBtn}>
          <Text>You are friend.</Text>
        </View>
      );
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_INCOMING) {
      return this.renderAction();
    }

    if (user.relationshipType === RELATIONSHIP_TYPE_OUTGOING) {
      return (
        <CustomButton
          style={styles.button}
          bgColor={Colors.background.red}
          onPress={this.cancelRequest}
        >
          Cancel friend request
        </CustomButton>
      );
    }

    return (
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={this.sendRequest}
      >
        {`Ask to be ${user.firstName}'s friend`}
      </CustomButton>
    );
  }

  hasRelation = () => {
    const { user } = this.state;
    return user.relation && user.relation.length > 0;
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

    if (user.fbId && user.fbId !== '') {
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

    if (user.twitterId && user.twitterId !== '') {
      return (
        <ProfileAction
          onPress={() => Linking.openURL(`https://twitter.com//${user.twitterId}`)}
          label="Twitter profile"
        />
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
        /><Text style={styles.actionLable}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.rejectRequest}
        style={styles.actionButton}
      >
        <Icon
          name="ios-close"
          size={24}
          color={Colors.text.white}
        /><Text style={styles.actionLable}>Reject</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { networkStatus, error } = this.props.data;
    const { user } = this.state;
    const supporter = false;

    if (error) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          <TouchableOpacity onPress={this.state.refetch}>
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
        <Avatar
          notTouchable
          isSupporter
          size={145}
          imageURI={user.avatar}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={[styles.lightText, styles.joinedDate]}>Joined <Date format="MMM Do YYYY">{user.createdAt}</Date></Text>
        <View style={styles.activityWrapper}>
          <View style={styles.hexagon}>
            <View style={styles.experienceCountWrapper}>
              <Image
                source={require('@assets/icons/ic_camera_head.png')}
                style={styles.sunRay}
              />
              <Text style={styles.experienceCount}>{user.totalExperiences}</Text>
            </View>
            <Text style={styles.activityLabel}>Experiences</Text>
          </View>
          <View style={styles.hexagon}>
            <Image
              source={supporter ? GardenActive : GardenInactive}
              style={styles.garden}
            />
            <Text style={styles.activityLabel}>Supporter</Text>
          </View>
        </View>
        {
          !this.isCurrentUser() && this.hasRelation() &&
          <View>
            <View style={styles.connectionLabel}>
              <Text style={styles.lightText}>This is how you know {user.firstName}</Text>
              <TouchableOpacity>
                <Image source={require('@assets/icons/icon_chevron_down.png')} style={styles.chevronDown} />
              </TouchableOpacity>
            </View>
            <View style={styles.connection}>
              <Relation
                users={user.relation}
                avatarSize={45}
              />
            </View>
          </View>
        }

        {this.friendRelationButtion()}
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
          label={`${user.totalComments || 0} ride ${(user.totalComments || 0) <= 1 ? 'conversation' : 'conversations'}`}
        />
        <ProfileAction
          label={`${user.totalGroups || 0} ${(user.totalGroups || 0) <= 1 ? 'group' : 'groups'}`}
          onPress={() => this.redirect('groups')}
        />
        <ProfileAction
          label={`${user.totalFriends || 0} ${(user.totalFriends || 0) <= 1 ? 'friend' : 'friends'}`}
          onPress={() => this.redirect('friends')}
        />
      </LinearGradient>
    );
  }
}

Profile.propTypes = {
  id: PropTypes.number.isRequired,
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
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  addFriend: PropTypes.func.isRequired,
  cancelFriendRequest: PropTypes.func.isRequired,
  rejectFriendRequest: PropTypes.func.isRequired,
  acceptFriendRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withAddFriend,
  withCancelFriendRequest,
  withAcceptFriendRequest,
  withRejectFriendRequest,
  withNavigation,
  connect(mapStateToProps),
)(Profile);
