import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { withReadNotification, withRejectGroupInvitation, withAcceptGroupRequest } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loading } from '@components/common';
import { withAcceptFriendRequest, withRejectFriendRequest } from '@services/apollo/friend';
import { withAcceptExperience, withRejectExperience } from '@services/apollo/experience';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  NOTIFICATION_TYPE_MEMBERSHIP_REQUEST,
  NOTIFICATION_TYPE_MEMBERSHIP_REQUEST_ACCEPTED,
  NOTIFICATION_TYPE_COMMENT,
  NOTIFICATION_TYPE_INVIVATION,
  NOTIFICATION_TYPE_FRIEND_REQUEST,
  NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED,
  NOTIFICATION_TYPE_EXPERIENCE_TAGGED,
  NOTIFICATION_TYPE_EXPERIENCE_VOID,
  NOTIFICATION_TYPE_EXPERIENCE_SHARED,
  NOTIFICATION_TYPE_EXPERIENCE_PUBLISHED,
  NOTIFICATION_TYPE_TRIP_SHARED,
  NOTIFICATION_TYPE_TRIP_SHARED_GROUP,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import Date from '@components/date';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  lightText: {
    color: Colors.text.gray,
  },
  blueText: {
    color: Colors.text.blue,
  },
  textWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 4,
  },
  time: {
    left: 'auto',
  },
  actions: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  accept: {
    marginRight: 8,
  },
  requestResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    opacity: 0.75,
  },
  requestResultLabel: {
    marginLeft: 2,
    color: Colors.text.gray,
  },
  requestResultIcon: {
    marginTop: 3,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

const ACTION_NONE = 0;
const ACTION_ACCEPTED = 1;
const ACTION_REJECTED = 2;

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, action: ACTION_NONE };
  }

  acceptGroupRequest = (id) => {
    const { acceptGroupRequest, notification } = this.props;
    this.setState({ loading: true });
    acceptGroupRequest(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_ACCEPTED }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectGroupRequest = (id) => {
    const { rejectGroupInvitation, notification } = this.props;
    this.setState({ loading: true });
    rejectGroupInvitation(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_REJECTED }))
      .catch(() => this.setState({ loading: false }));
  }

  acceptFriendRequest = (id) => {
    const { acceptFriendRequest, notification, user } = this.props;
    this.setState({ loading: true });
    acceptFriendRequest(id, user.id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_ACCEPTED }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectFriendRequest = (id) => {
    const { rejectFriendRequest, notification } = this.props;
    this.setState({ loading: true });
    rejectFriendRequest(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_REJECTED }))
      .catch(() => this.setState({ loading: false }));
  }

  redirect = (id, route, params) => {
    const { navigation, filters, notification, markRead } = this.props;

    if (id && filters === 'new') {
      markRead(id).then(notification.refetch);
    }

    navigation.navigate(route, params);
  }

  friendRequest = ({ User, Notifiable }) => (
    <TouchableOpacity onPress={() => this.redirect(null, 'Profile', { profileId: User.id })}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {this.renderPic(User.avatar, User.id)}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bold, styles.blueText]}>{User.firstName} </Text>
            <Text>
              wants to be your friend.
            </Text>
          </View>
        </View>
        {this.state.loading ?
          <Loading /> :
          this.renderAction(
            Notifiable.id,
            this.acceptFriendRequest,
            this.rejectFriendRequest,
          )}
      </View>
    </TouchableOpacity>
  );

  requestJoinGroup = ({ User, Notifiable }) => (
    <TouchableOpacity onPress={() => this.redirect(null, 'GroupDetail', { notifier: User, group: Notifiable.Group, notificationMessage: 'is requesting to join this group.' })}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {this.renderPic(User.avatar, User.id)}
          </View>
          <View style={{ flex: 1 }}>
            <Text onPress={() => this.redirect(null, 'Profile', { profileId: User.id })} style={[styles.bold, styles.blueText]}>{User.firstName} </Text>
            <Text>
              wants to participate in your group
              <Text style={styles.bold}> {Notifiable.Group.name} </Text>
            </Text>
          </View>
        </View>
        {this.state.loading ?
          <Loading /> :
          this.renderAction(
            Notifiable.id,
            this.acceptGroupRequest,
            this.rejectGroupRequest,
          )}
      </View>
    </TouchableOpacity>
  );

  item = ({ user, photo, text, onPress, userId, experience, noAvatarAction, date }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {
              experience
                ? this.renderExperiencePic(photo, experience, noAvatarAction)
                : this.renderPic(photo, userId)
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text>
              {
                user &&
                <Text style={[styles.bold, styles.blueText]}>{user}</Text>
              }
            </Text>
            <Text>
              {text}
            </Text>
          </View>
        </View>
        <View>
          {<Text style={[styles.time, styles.bold]}><Date format="MMM DD">{date}</Date></Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  memberRequest = ({ Notifiable, User, date, id }) => {
    if (Notifiable && Notifiable.gmrStatus === 'pending') {
      return this.requestJoinGroup({ User, Notifiable });
    }

    if (Notifiable && Notifiable.gmrStatus === 'accepted') {
      return this.item({
        userId: User.id,
        photo: User.avatar,
        text: `You have accepted ${User.firstName}'s request to join group "${Notifiable.Group.name}"`,
        date,
        onPress: () => this.redirect(id, 'GroupDetail', { group: Notifiable.Group }),
      });
    }

    return null;
  }

  membershipRequestAccepted = ({ Notifiable, User, createdAt, id }) => {
    if (Notifiable) {
      return this.item({
        userId: User.id,
        user: User.firstName,
        photo: User.avatar,
        text: `${trans('message.added_you_to_group')} "${Notifiable.name}"`,
        date: createdAt,
        onPress: () => this.redirect(id, 'GroupDetail', {
          group: Notifiable,
          notifier: User,
          notificationMessage: trans('message.added_you_to_this_group'),
        }),
      });
    }

    return null;
  }

  friendRequestAccepted = ({ Notifiable, User, createdAt, id }) => {
    if (Notifiable) {
      return this.item({
        userId: User.id,
        photo: User.avatar,
        text: `${trans('message.you_and')} ${User.firstName} ${trans('message.are_now_friends')}`,
        date: createdAt,
        onPress: () => this.redirect(id, 'Profile', { profileId: User.id }),
      });
    }

    return null;
  }

  experienceVoid = ({ Notifiable, createdAt }) => {
    if (Notifiable) {
      return this.item({
        photo: Notifiable.photo,
        text: trans('message.one_participant_said_no'),
        date: createdAt,
        noAvatarAction: true,
        experience: {},
      });
    }

    return null;
  }

  experiencePublished = ({ Notifiable, User, createdAt, id }) => {
    if (Notifiable) {
      return this.item({
        userId: User.id,
        photo: Notifiable.photo,
        experience: Notifiable,
        text: trans('message.your_experience_has_been_published'),
        date: createdAt,
        onPress: () => this.redirect(id, 'ExperienceScreen', { experience: Notifiable }),
      });
    }

    return null;
  }

  experienceShared = ({ Notifiable, User, createdAt, id }) => {
    if (Notifiable) {
      return this.item({
        userId: User.id,
        user: User.firstName,
        photo: User.avatar,
        text: trans('message.shared_experience_with_you'),
        date: createdAt,
        onPress: () => this.redirect(id, 'ExperienceScreen', { experience: Notifiable }),
      });
    }

    return null;
  }

  acceptTagRequest = (id) => {
    const { acceptExperience, notification } = this.props;
    this.setState({ loading: true });
    acceptExperience(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_ACCEPTED }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectTagRequest = (id) => {
    const { rejectExperience, notification } = this.props;
    this.setState({ loading: true });
    rejectExperience(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: ACTION_REJECTED }))
      .catch(() => this.setState({ loading: false }));
  }

  experienceTagged = ({ User, Notifiable }) => (
    <TouchableOpacity
      onPress={() => this.redirect(null, 'ExperienceScreen', { experience: Notifiable })}
    >
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {this.renderPic(User.avatar, User.id)}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bold, styles.blueText]}>{User.firstName} </Text>
            <Text>
              {trans('message.tagged_you_in_an_experience')}
            </Text>
          </View>
        </View>
        {this.state.loading ?
          <Loading /> :
          this.renderAction(
            Notifiable.id,
            this.acceptTagRequest,
            this.rejectTagRequest,
          )}
      </View>
    </TouchableOpacity>
  );

  tripShared = ({ Notifiable, User, createdAt }) => {
    let type = null;

    if (Notifiable) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;

      if (type.length > 17) {
        type = `${type.slice(0, 17)} ...`;
      }

      return this.item({
        userId: User.id,
        user: User.firstName,
        photo: User.avatar,
        text: `${type}`,
        date: createdAt,
        onPress: () => this.redirect(Notifiable.id, 'TripDetail', { trip: Notifiable }),
      });
    }

    return null;
  }

  tripSharedGroup = ({ Notifiable, User, createdAt }) => {
    if (Notifiable) {
      return this.item({
        userId: User.id,
        user: User.firstName,
        photo: User.avatar,
        text: trans('message.shared_a_trip_on_your_group'),
        date: createdAt,
        onPress: () => this.redirect(Notifiable.id, 'TripDetail', { trip: Notifiable, notifier: User, notificationMessage: 'Shared this trip on your group.' }),
      });
    }

    return null;
  }

  comment = ({ notifiable, Notifiable, User, id, createdAt }) => {
    let type = null;
    let params = null;
    let route = null;
    let itemFields = null;

    if (notifiable === FEEDABLE_GROUP) {
      type = `${Notifiable.name}`;
      route = 'GroupDetail';
      params = { group: Notifiable, notifier: User, notificationMessage: trans('message.commented_on_this_group') };
      itemFields = {
        userId: User.id,
        user: `${type}`,
        photo: User.avatar,
        text: `${User.firstName} ${trans('message.left_a_comment')}`,
        date: createdAt,
        onPress: () => this.redirect(id, route, params),
      };
    }

    if (notifiable === FEEDABLE_TRIP) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;
      route = 'TripDetail';
      params = { trip: Notifiable, notifier: User, notificationMessage: trans('message.commented_on_this_ride') };

      if (type && type.length > 17) {
        type = `${type.slice(0, 17)} ...`;
      }

      itemFields = {
        userId: User.id,
        user: User.firstName,
        photo: User.avatar,
        text: `${type}`,
        date: createdAt,
        onPress: () => this.redirect(id, route, params),
      };
    }

    if (itemFields) {
      return this.item(itemFields);
    }

    return null;
  }

  invitation = ({ notifiable, Notifiable, User, createdAt, id }) => {
    let type = null;
    let params = null;
    let route = null;

    if (notifiable === FEEDABLE_GROUP) {
      type = `${trans('message.shared_group')} ${Notifiable.name} ${trans('message.to_you')}`;
      route = 'GroupDetail';
      params = { group: Notifiable, notifier: User, notificationMessage: trans('message.shared_this_group_with_you') };
    }

    if (notifiable === FEEDABLE_TRIP) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;
      route = 'TripDetail';
      params = { trip: Notifiable, notifier: User, notificationMessage: 'Shared this trip with you' };

      if (type && type.length > 17) {
        type = `${type.slice(0, 17)} ...`;
      }
    }

    return this.item({
      userId: User.id,
      user: User.firstName,
      photo: User.avatar,
      text: `${type}`,
      date: createdAt,
      onPress: () => this.redirect(id, route, params),
    });
  }

  renderAction = (id, accept, reject) => {
    const { action } = this.state;

    if (action === ACTION_NONE) {
      return (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => accept(id)}
            style={styles.accept}
          >
            <Icon
              name="ios-checkmark-circle-outline"
              size={32}
              color={Colors.text.blue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => reject(id)}
          >
            <Icon
              name="ios-close-circle-outline"
              size={32}
              color={Colors.text.red}
            />
          </TouchableOpacity>
        </View>
      );
    }

    if (action === ACTION_ACCEPTED) {
      return (
        <View style={styles.requestResult}>
          <Icon
            name="ios-checkmark"
            size={24}
            color={Colors.text.blue}
            style={styles.requestResultIcon}
          />
          <View>
            <Text style={styles.requestResultLabel}>Accepted</Text>
          </View>
        </View>
      );
    }

    if (action === ACTION_REJECTED) {
      return (
        <View style={styles.requestResult}>
          <Icon
            name="ios-close"
            size={24}
            color={Colors.text.blue}
            style={styles.requestResultIcon}
          />
          <View>
            <Text style={styles.requestResultLabel}>Rejected</Text>
          </View>
        </View>
      );
    }

    return null;
  }

  renderPic = (photo, userId) => {
    let profileImage = null;
    if (photo) {
      profileImage = (
        <TouchableOpacity onPress={() => this.redirect(null, 'Profile', { profileId: userId })}>
          <Image source={{ uri: photo }} style={styles.profilePic} />
        </TouchableOpacity>
      );
    }

    return profileImage;
  }

  renderExperiencePic = (photo, Notifiable, noAvatarAction) => {
    let profileImage = null;
    if (photo) {
      profileImage = (
        <TouchableOpacity onPress={() => this.redirect(null, 'ExperienceScreen', { experience: Notifiable })}>
          <Image source={{ uri: photo }} style={styles.profilePic} />
        </TouchableOpacity>
      );

      if (noAvatarAction) {
        profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
      }
    }

    return profileImage;
  }

  render() {
    const { notification } = this.props;
    let message = null;

    if (notification.type === NOTIFICATION_TYPE_MEMBERSHIP_REQUEST) {
      message = this.memberRequest(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_MEMBERSHIP_REQUEST_ACCEPTED) {
      message = this.membershipRequestAccepted(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_COMMENT) {
      message = this.comment(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_INVIVATION) {
      message = this.invitation(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_FRIEND_REQUEST) {
      message = this.friendRequest(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED) {
      message = this.friendRequestAccepted(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_EXPERIENCE_TAGGED) {
      message = this.experienceTagged(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_EXPERIENCE_VOID) {
      message = this.experienceVoid(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_EXPERIENCE_SHARED) {
      message = this.experienceShared(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_EXPERIENCE_PUBLISHED) {
      message = this.experiencePublished(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_TRIP_SHARED) {
      message = this.tripShared(notification);
    }

    if (notification.type === NOTIFICATION_TYPE_TRIP_SHARED_GROUP) {
      message = this.tripSharedGroup(notification);
    }

    return (
      <View key={notification.id}>
        {message}
      </View>
    );
  }
}

Item.propTypes = {
  filters: PropTypes.string.isRequired,
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.object.isRequired,
  }).isRequired,
  rejectGroupInvitation: PropTypes.func.isRequired,
  acceptGroupRequest: PropTypes.func.isRequired,
  markRead: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  rejectFriendRequest: PropTypes.func.isRequired,
  acceptFriendRequest: PropTypes.func.isRequired,
  acceptExperience: PropTypes.func.isRequired,
  rejectExperience: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withReadNotification,
  withRejectGroupInvitation,
  withAcceptGroupRequest,
  withAcceptFriendRequest,
  withRejectFriendRequest,
  withAcceptExperience,
  withRejectExperience,
  withNavigation,
  connect(mapStateToProps),
)(Item);
