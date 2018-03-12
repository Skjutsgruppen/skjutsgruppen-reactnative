import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { withReadNotification, withRejectGroupInvitation, withAcceptGroupRequest } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loading } from '@components/common';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  NOTIFICATION_TYPE_MEMBERSHIP_REQUEST,
  NOTIFICATION_TYPE_MEMBERSHIP_REQUEST_ACCEPTED,
  NOTIFICATION_TYPE_FRIEND_REQUEST,
  NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED,
  NOTIFICATION_TYPE_EXPERIENCE_TAGGED,
  NOTIFICATION_TYPE_EXPERIENCE_REJECTED,
  NOTIFICATION_TYPE_EXPERIENCE_PUBLISHED,
  NOTIFICATION_CHARACTER_COUNT,
  NOTIFICATION_TYPE_EXPERIENCE_REMOVED,
  NOTIFICATION_TYPE_FRIEND_JOINED_MOVEMENT,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import Date from '@components/date';
import { connect } from 'react-redux';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '500',
  },
  lightText: {
    color: Colors.text.gray,
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
    paddingRight: 20,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  experienceIconWrapper: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceIcon: {
    maxHeight: '100%',
    maxWidth: '100%',
    resizeMode: 'contain',
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 12,
  },
  profilePic: {
    width: 56,
    height: 56,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
  },
  shiftedProfilePic: {
    marginLeft: -16,
    zIndex: 1,
  },
  avatar: {
    height: 48,
    width: 48,
    resizeMode: 'cover',
  },
  time: {
    left: 'auto',
    paddingLeft: 10,
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

  redirect = (id, ids, route, params) => {
    const { navigation, filters, notification, markRead } = this.props;

    if (id && filters === 'new') {
      markRead(id, ids).then(notification.refetch);
    }

    navigation.navigate(route, params);
  }

  friendRequest = ({ Notifiers, id, ids, createdAt }) => {
    const { filters } = this.props;
    return (
      <TouchableOpacity onPress={() => this.redirect(id, ids, 'Profile', { profileId: Notifiers[0].id })}>
        <View style={styles.list}>
          <View style={styles.flexRow}>
            <View style={styles.profilePicWrapper}>
              {this.renderPic([Notifiers[0].avatar])}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>{Notifiers[0].firstName} </Text>
              <Text style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>
                wants to be your friend.
              </Text>
            </View>
            <View>
              <Text>
                <Date calenderTime>{createdAt}</Date>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  requestJoinGroup = ({ User, Notifiable, id, ids }) => {
    const { filters } = this.props;

    return (
      <TouchableOpacity onPress={() => this.redirect(id, ids, 'GroupDetail', { notifier: User, group: Notifiable.Group, notificationMessage: 'is requesting to join this group.' })}>
        <View style={styles.list}>
          <View style={styles.flexRow}>
            <View style={styles.profilePicWrapper}>
              {this.renderPic([User.avatar])}
            </View>
            <View style={{ flex: 1 }}>
              <Text onPress={() => this.redirect(id, ids, 'Profile', { profileId: User.id })} style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>{Notifiable.Group.name}</Text>
              <Text style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>Participation request</Text>
            </View>
          </View>
          {this.state.loading ?
            <Loading /> :
            this.renderAction(
              Notifiable.id,
              [],
              this.acceptGroupRequest,
              this.rejectGroupRequest,
            )}
        </View>
      </TouchableOpacity>
    );
  }

  item = ({
    user,
    photo,
    text,
    onPress,
    userId,
    experience,
    noAvatarAction,
    date,
    ellipsize = true,
  }) => {
    const { filters } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.list}>
          <View style={styles.flexRow}>
            <View style={styles.profilePicWrapper}>
              {
                experience
                  ? this.renderExperiencePic(experience, noAvatarAction)
                  : this.renderPic(photo, userId)
              }
            </View>
            <View style={[{ flex: 1 }]}>
              {
                user &&
                <Text style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>{user}</Text>
              }
              {
                ellipsize ?
                  (<Text style={[filters === 'new' && styles.bold]} numberOfLines={1} ellipsizeMode={'tail'}>
                    {text}
                  </Text>) :
                  (<Text style={[filters === 'new' && styles.bold]}>
                    {text}
                  </Text>)
              }
            </View>
          </View>
          <View>
            {<Text style={[filters === 'new' && styles.bold, styles.time]}><Date calendarTime>{date}</Date></Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  memberRequest = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable && Notifiable.gmrStatus === 'pending') {
      return this.requestJoinGroup({ User: Notifiers[0], Notifiable, id });
    }

    if (Notifiable && Notifiable.gmrStatus === 'accepted') {
      return this.item({
        userId: Notifiers[0].id,
        photo: [Notifiers[0].avatar],
        text: `You have accepted ${Notifiers[0].firstName}'s request to join group "${Notifiable.Group.name}"`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'GroupDetail', { group: Notifiable.Group }),
      });
    }

    return null;
  }

  membershipRequestAccepted = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        userId: Notifiers[0].id,
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        text: `${trans('message.added_you_to_group')} "${Notifiable.name}"`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'GroupDetail', {
          group: Notifiable,
          notifier: Notifiers[0],
          notificationMessage: trans('message.added_you_to_this_group'),
        }),
      });
    }

    return null;
  }

  friendRequestAccepted = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        userId: Notifiers[0].id,
        photo: [Notifiers[0].avatar],
        text: `${trans('message.you_and')} ${Notifiers[0].firstName}\n${trans('message.are_now_friends')}`,
        date: createdAt,
        ellipsize: false,
        onPress: () => this.redirect(id, ids, 'Profile', { profileId: Notifiers[0].id }),
      });
    }

    return null;
  }

  experienceRejected = ({ Notifiable, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        photo: [Notifiable.photo],
        text: trans('message.one_participant_said_no'),
        date: createdAt,
        noAvatarAction: true,
        experience: {},
        onPress: () => this.redirect(id, ids, 'ExperienceDetail', { experience: Notifiable }),
      });
    }

    return null;
  }

  experienceRemoved = ({ Notifiable, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        photo: [Notifiable.photo],
        text: trans('message.one_participant_removed'),
        date: createdAt,
        noAvatarAction: true,
        experience: {},
        onPress: () => this.redirect(id, ids, 'ExperienceDetail', { experience: Notifiable }),
      });
    }

    return null;
  }

  experiencePublished = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        userId: Notifiers[0].id,
        photo: [Notifiable.photo],
        experience: Notifiable,
        noAvatarAction: true,
        text: trans('message.your_experience_has_been_published'),
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'TripDetail', { trip: Notifiable.Trip }),
      });
    }

    return null;
  }

  experienceShared = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        userId: Notifiers[0].id,
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        text: trans('message.shared_experience_with_you'),
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'ExperienceDetail', { experience: Notifiable }),
      });
    }

    return null;
  }

  experienceTagged = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        userId: Notifiers[0].id,
        text: `${trans('message.tagged_you_in_an_experience')}`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'ExperienceDetail', { experience: Notifiable }),
      });
    }

    return null;
  }

  tripShared = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    let type = null;

    if (Notifiable) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;

      if (type.length > NOTIFICATION_CHARACTER_COUNT) {
        type = `${type.slice(0, NOTIFICATION_CHARACTER_COUNT)} ...`;
      }

      return this.item({
        userId: Notifiers[0].id,
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        text: `${type}`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'TripDetail', { trip: Notifiable }),
      });
    }

    return null;
  }

  tripSharedGroup = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    if (Notifiable) {
      return this.item({
        userId: Notifiers[0].id,
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        text: trans('message.shared_a_trip_on_your_group'),
        date: createdAt,
        onPress: () => this.redirect(id, ids, 'TripDetail', { group: Notifiable, notifier: Notifiers[0], notificationMessage: 'Group' }),
      });
    }

    return null;
  }

  comment = ({ notifiable, Notifiable, Notifiers, id, ids, createdAt }) => {
    let type = null;
    let params = null;
    let route = null;
    let itemFields = null;

    if (notifiable === FEEDABLE_GROUP) {
      type = `${Notifiable.name}`;
      route = 'GroupDetail';
      params = { group: Notifiable, notifier: Notifiers[0], notificationMessage: trans('message.commented_on_this_group') };
      itemFields = {
        userId: Notifiers[0].id,
        user: `${type}`,
        photo: [Notifiers[0].avatar],
        text: `${Notifiers[0].firstName} ${trans('message.left_a_comment')}`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, route, params),
      };
    }

    if (notifiable === FEEDABLE_TRIP) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;
      route = 'TripDetail';
      params = { trip: Notifiable, notifier: Notifiers[0], notificationMessage: trans('message.commented_on_this_ride') };

      if (type && type.length > NOTIFICATION_CHARACTER_COUNT) {
        type = `${type.slice(0, NOTIFICATION_CHARACTER_COUNT)} ...`;
      }

      itemFields = {
        userId: Notifiers[0].id,
        user: Notifiers[0].firstName,
        photo: [Notifiers[0].avatar],
        text: `${type}`,
        date: createdAt,
        onPress: () => this.redirect(id, ids, route, params),
      };
    }

    if (itemFields) {
      return this.item(itemFields);
    }

    return null;
  }

  invitation = ({ notifiable, Notifiable, Notifiers, createdAt, id, ids }) => {
    let type = null;
    let params = null;
    let route = null;

    if (notifiable === FEEDABLE_GROUP) {
      type = `${trans('message.shared_group')} ${Notifiable.name} ${trans('message.to_you')}`;
      route = 'GroupDetail';
      params = { group: Notifiable, notifier: Notifiers[0], notificationMessage: trans('message.shared_this_group_with_you') };
    }

    if (notifiable === FEEDABLE_TRIP) {
      type = `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;
      route = 'TripDetail';
      params = { trip: Notifiable, notifier: Notifiers[0], notificationMessage: 'Shared this trip with you' };

      if (type && type.length > NOTIFICATION_CHARACTER_COUNT) {
        type = `${type.slice(0, NOTIFICATION_CHARACTER_COUNT)} ...`;
      }
    }

    return this.item({
      userId: Notifiers[0].id,
      user: Notifiers[0].firstName,
      photo: [Notifiers[0].avatar],
      text: `${type}`,
      date: createdAt,
      onPress: () => this.redirect(id, ids, route, params),
    });
  }

  tripNotificationBundle = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    const route = 'TripDetail';
    const params = { trip: Notifiable };
    const plus = Notifiers.length - 1;

    return this.item({
      userId: Notifiers[0],
      user: (plus > 0) ? `${Notifiers[plus].firstName} +  ${plus}` : `${Notifiers[plus].firstName}`,
      photo: (plus > 0) ?
        [Notifiers[plus].avatar, Notifiers[plus - 1].avatar] :
        [Notifiers[plus].avatar],
      text: `${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`,
      date: createdAt,
      onPress: () => this.redirect(id, ids, route, params),
    });
  }

  groupNotificationBundle = ({ Notifiable, Notifiers, createdAt, id, ids }) => {
    const route = 'GroupDetail';
    const params = { group: Notifiable };
    const plus = Notifiers.length - 1;

    return this.item({
      userId: Notifiers[0],
      user: `${Notifiable.name}`,
      photo: (plus > 0) ?
        [Notifiers[plus].avatar, Notifiers[plus - 1].avatar] :
        [Notifiers[plus].avatar],
      text: (plus > 0) ? `${Notifiers[plus].firstName} +  ${plus}` : `${Notifiers[plus].firstName}`,
      date: createdAt,
      onPress: () => this.redirect(id, ids, route, params),
    });
  }

  friendJoinedMovement = ({ Notifiers, createdAt, id, ids }) => {
    const route = 'Profile';
    const params = { profileId: Notifiers[0].id };

    return this.item({
      userId: Notifiers[0].id,
      user: `${Notifiers[0].firstName}`,
      photo: [Notifiers[0].avatar],
      text: 'just joined the movement',
      date: createdAt,
      onPress: () => this.redirect(id, ids, route, params),
    });
  }

  renderAction = (id, bundleId, accept, reject) => {
    const { action } = this.state;

    if (action === ACTION_NONE) {
      return (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => accept(id, bundleId)}
            style={styles.accept}
          >
            <Icon
              name="ios-checkmark-circle-outline"
              size={32}
              color={Colors.text.blue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => reject(id, bundleId)}
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

  renderPic = photo => photo.map((imageURI, index) => {
    const style = index === 1 ? [styles.profilePic, styles.shiftedProfilePic] : styles.profilePic;
    const key = `avatar${index}`;
    return (
      <View style={style} key={key}>
        <Image source={{ uri: imageURI }} style={styles.avatar} />
      </View>
    );
  });

  renderExperiencePic = (Notifiable, noAvatarAction) => {
    let profileImage = null;

    profileImage = (
      <TouchableOpacity onPress={() => this.redirect(null, [], 'ExperienceDetail', { experience: Notifiable })}>
        <Image source={ExperienceIcon} style={styles.profilePic} />
      </TouchableOpacity>
    );

    if (noAvatarAction) {
      profileImage = (
        <View style={styles.experienceIconWrapper}>
          <Image source={ExperienceIcon} style={styles.experienceIcon} />
        </View>
      );
    }

    return profileImage;
  }

  render() {
    const { notification } = this.props;
    let message = null;

    if (notification.notifiable === 'Trip') {
      message = this.tripNotificationBundle(notification);
    }

    if (notification.notifiable === 'Group') {
      message = this.groupNotificationBundle(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_MEMBERSHIP_REQUEST) {
      message = this.memberRequest(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_MEMBERSHIP_REQUEST_ACCEPTED) {
      message = this.membershipRequestAccepted(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_FRIEND_REQUEST) {
      message = this.friendRequest(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED) {
      message = this.friendRequestAccepted(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_EXPERIENCE_TAGGED) {
      message = this.experienceTagged(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_EXPERIENCE_REMOVED) {
      message = this.experienceRemoved(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_EXPERIENCE_REJECTED) {
      message = this.experienceRejected(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_EXPERIENCE_PUBLISHED) {
      message = this.experiencePublished(notification);
    }

    if (notification.Notifications[0].type === NOTIFICATION_TYPE_FRIEND_JOINED_MOVEMENT) {
      message = this.friendJoinedMovement(notification);
    }

    return (
      <View key={notification.Notifiable.id}>
        {message}
      </View>
    );
  }
}

Item.propTypes = {
  filters: PropTypes.string.isRequired,
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Notifiers: PropTypes.arrayOf.isRequired,
    Notifications: PropTypes.arrayOf.isRequired,
    Notifiable: PropTypes.object.isRequired,
    notifiable: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  rejectGroupInvitation: PropTypes.func.isRequired,
  acceptGroupRequest: PropTypes.func.isRequired,
  markRead: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withReadNotification,
  withRejectGroupInvitation,
  withAcceptGroupRequest,
  withNavigation,
  connect(mapStateToProps),
)(Item);
