import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import CustomButton from '@components/common/customButton';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Relation from '@components/relation';
import { withAddFriend, withAcceptFriendRequest, withRejectFriendRequest, withCancelFriendRequest } from '@services/apollo/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { trans } from '@lang/i18n';
import {
  RELATIONSHIP_TYPE_FRIEND,
  RELATIONSHIP_TYPE_INCOMING,
  RELATIONSHIP_TYPE_OUTGOING,
} from '@config/constant';

const styles = StyleSheet.create({
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 12,
    marginHorizontal: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.blue,
    marginBottom: 16,
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
    height: 60,
    width: 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garden: {
    resizeMode: 'contain',
  },
  experienceCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c1ab44',
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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = ({ isRequestPending: false });
  }

  onPressProfile = (id) => {
    const { navigation } = this.props;

    navigation.navigate('UserProfile', { profileId: id });
  }

  onRefreshClick = () => {
    const { data: { refetch } } = this.props;
    refetch();
  }

  getPrefix = () => {
    const { data: { profile } } = this.props;

    return this.isCurrentUser() ? 'My' : `${profile.firstName}'s`;
  }

  redirect = (type) => {
    const { navigation, id } = this.props;

    if (type === 'groups') {
      navigation.navigate('UserGroups', { userId: id });
    }

    if (type === 'friends') {
      navigation.navigate('UserFriends', { id });
    }

    if (type === 'ride') {
      navigation.navigate('UserTrips', { userId: id });
    }

    if (type === 'experiences') {
      navigation.navigate('UserExperiences', { userId: id });
    }
  }

  sendRequest = () => {
    const { id, data: { refetch } } = this.props;
    this.setState({ loading: true }, () => {
      this.props.addFriend(id)
        .then(refetch)
        .then(() => this.setState({ isRequestPending: true, loading: false }))
        .catch(() => this.setState({ loading: false }));
    });
  }

  cancelRequest = () => {
    const { data: { profile, refetch } } = this.props;
    this.setState({ loading: true }, () => {
      this.props.cancelFriendRequest(profile.FriendRequest.id)
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
    const { data: { profile } } = this.props;
    const { loading } = this.state;

    if (this.isCurrentUser()) {
      return null;
    }

    if (loading) {
      return (<Loading />);
    }

    if (profile.relationshipType === RELATIONSHIP_TYPE_FRIEND) {
      return (
        <View style={styles.disabledBtn}>
          <Text>You are friend.</Text>
        </View>
      );
    }

    if (profile.relationshipType === RELATIONSHIP_TYPE_INCOMING) {
      return this.renderAction();
    }

    if (profile.relationshipType === RELATIONSHIP_TYPE_OUTGOING) {
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
        {`Ask to be ${profile.firstName}'s friend`}
      </CustomButton>
    );
  }

  hasRelation = () => {
    const { data: { profile } } = this.props;
    return profile.relation.length > 0;
  }

  acceptRequest = () => {
    const { acceptFriendRequest, data: { profile, refetch } } = this.props;

    this.setState({ loading: true });
    acceptFriendRequest(profile.FriendRequest.id)
      .then(refetch)
      .then(() => this.setState({ loading: false, action: 1 }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectRequest = () => {
    const { rejectFriendRequest, data: { profile, refetch } } = this.props;

    this.setState({ loading: true });
    rejectFriendRequest(profile.FriendRequest.id)
      .then(refetch)
      .then(() => this.setState({ loading: false, action: 2 }))
      .catch(() => this.setState({ loading: false }));
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
    const { data: { networkStatus, profile, error }, navigation } = this.props;

    if (error) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          <TouchableOpacity onPress={this.onRefreshClick}>
            <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (networkStatus === 1) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <View>
        <Image source={{ uri: profile.avatar }} style={styles.profilePic} />
        <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
        <View style={styles.activityWrapper}>
          <View>
            <View style={styles.hexagon}>
              <Text style={styles.experienceCount}>{profile.totalExperiences}</Text>
            </View>
            <Text style={styles.activityLabel}>Experiences</Text>
          </View>
          <View>
            <Image
              source={require('@assets/icons/icon_garden_line.png')}
              style={[styles.hexagon, styles.garden]}
            />
            <Text style={styles.activityLabel}>Supporter</Text>
          </View>
        </View>
        <View style={styles.activityWrapper}>
          <View style={styles.activity}>
            <Text style={styles.count}>{profile.totalOffered}</Text>
            <Text style={styles.activityLabel}>Offered {'\n'} rides</Text>
          </View>
          <View style={styles.activity}>
            <Text style={styles.count}>{profile.totalAsked}</Text>
            <Text style={styles.activityLabel}>Asked {'\n'} for rides</Text>
          </View>
          <View style={styles.activity}>
            <Text style={styles.count}>-</Text>
            <Text style={styles.activityLabel}>Talked {'\n'} about</Text>
          </View>
        </View>
        {!this.isCurrentUser() && this.hasRelation() &&
          <View>
            <View style={styles.connectionLabel}>
              <Text style={styles.lightText}>This is how you know {profile.firstName}</Text>
              <TouchableOpacity>
                <Image source={require('@assets/icons/icon_chevron_down.png')} style={styles.chevronDown} />
              </TouchableOpacity>
            </View>
            <View style={styles.connection}>
              <Relation
                navigation={navigation}
                users={profile.relation}
                avatarSize={45}
              />
            </View>
          </View>
        }
        {this.friendRelationButtion()}
        <View style={styles.listWrapper}>
          <TouchableOpacity onPress={() => this.redirect('experiences')} style={styles.list}>
            <Text style={styles.listLabel}>{this.getPrefix()} experiences</Text>
            <Image source={require('@assets/icons/icon_chevron_right.png')} style={styles.connectionArrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.listWrapper}>
          <TouchableOpacity onPress={() => this.redirect('ride')} style={styles.list}>
            <Text style={styles.listLabel}>{this.getPrefix()} ride</Text>
            <Image source={require('@assets/icons/icon_chevron_right.png')} style={styles.connectionArrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.listWrapper}>
          <TouchableOpacity onPress={() => this.redirect('groups')} style={styles.list}>
            <Text style={styles.listLabel}>{this.getPrefix()} groups</Text>
            <Image source={require('@assets/icons/icon_chevron_right.png')} style={styles.connectionArrow} />
          </TouchableOpacity>
        </View>
        <View style={[styles.listWrapper, styles.lastListWrapper]}>
          <TouchableOpacity onPress={() => this.redirect('friends')} style={styles.list}>
            <Text style={styles.listLabel}>{this.getPrefix()} friends</Text>
            <Image source={require('@assets/icons/icon_chevron_right.png')} style={styles.connectionArrow} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Profile.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.object,
  }).isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
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
  connect(mapStateToProps),
)(Profile);
