import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { withReadNotification, withRejectGroupInvitation, withAcceptGroupRequest } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loading } from '@components/common';
import { withAcceptFriendRequest, withRejectFriendRequest } from '@services/apollo/auth';

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

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, action: 0 };
  }

  acceptGroupRequest = (id) => {
    const { acceptGroupRequest, notification } = this.props;
    this.setState({ loading: true });
    acceptGroupRequest(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: 1 }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectGroupRequest = (id) => {
    const { rejectGroupInvitation, notification } = this.props;
    this.setState({ loading: true });
    rejectGroupInvitation(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: 2 }))
      .catch(() => this.setState({ loading: false }));
  }

  acceptFriendRequest = (id) => {
    const { acceptFriendRequest, notification } = this.props;
    this.setState({ loading: true });
    acceptFriendRequest(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: 1 }))
      .catch(() => this.setState({ loading: false }));
  }

  rejectFriendRequest = (id) => {
    const { rejectFriendRequest, notification } = this.props;
    this.setState({ loading: true });
    rejectFriendRequest(id)
      .then(notification.refetch)
      .then(() => this.setState({ loading: false, action: 2 }))
      .catch(() => this.setState({ loading: false }));
  }

  redirect = (id, route, params) => {
    const { navigation, filters, notification, markRead } = this.props;

    if (filters === 'new') {
      markRead(id).then(notification.refetch);
    }

    navigation.navigate(route, params);
  }

  friendRequest = ({ User, FriendRequest }) => (
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {this.renderPic(User.avatar)}
        </View>
        <Text style={styles.textWrap}>
          <Text style={[styles.bold, styles.blueText]}>{User.firstName} </Text>
          <Text>
            sent you friend request.
          </Text>
        </Text>
      </View>
      {this.state.loading ?
        <Loading /> :
        this.renderAction(
          FriendRequest.id,
          this.acceptFriendRequest,
          this.rejectFriendRequest,
        )}
    </View>
  );

  requestJoinGroup = ({ User, GroupMembershipRequest }) => (
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {this.renderPic(User.avatar)}
        </View>
        <Text style={styles.textWrap}>
          <Text style={[styles.bold, styles.blueText]}>{User.firstName} </Text>
          <Text>
            has requested to join
            <Text style={styles.bold}> {GroupMembershipRequest.Group.name} </Text>
            group
            <Text style={styles.bold}>
              {GroupMembershipRequest.Group.TripStart.name}
              -
              {GroupMembershipRequest.Group.TripEnd.name}
            </Text>
          </Text>
        </Text>
      </View>
      {this.state.loading ?
        <Loading /> :
        this.renderAction(
          GroupMembershipRequest.id,
          this.acceptGroupRequest,
          this.rejectGroupRequest,
        )}
    </View>
  );

  item = ({ user, photo, text, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {this.renderPic(photo)}
          </View>
          <View style={{ flex: 1 }}>
            <Text>
              {
                user &&
                <Text style={[styles.bold, styles.blueText]}>{user} </Text>
              }
              {text}
            </Text>
          </View>
        </View>
        <View>
          {/* <Text style={[styles.time, styles.bold]}>{date}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  memberRequest = ({ GroupMembershipRequest, User, date, id }) => {
    if (GroupMembershipRequest && GroupMembershipRequest.gmrStatus === 'pending') {
      return this.requestJoinGroup({ User, GroupMembershipRequest });
    }

    if (GroupMembershipRequest && GroupMembershipRequest.gmrStatus === 'accepted') {
      return this.item({
        photo: User.avatar,
        text: `You have accepted ${User.firstName}'s request to join group "${GroupMembershipRequest.Group.name}"`,
        date,
        onPress: () => this.redirect(id, 'GroupDetail', { group: GroupMembershipRequest.Group }),
      });
    }

    return null;
  }

  membershipRequestAccepted = ({ Group, User, date, id }) => {
    if (Group) {
      return this.item({
        user: User.firstName,
        photo: User.avatar,
        text: `accepted your request to join group "${Group.name}"`,
        date,
        onPress: () => this.redirect(id, 'GroupDetail', { group: Group }),
      });
    }

    return null;
  }

  friendRequestAccepted = ({ FriendRequest, User, date, id }) => {
    if (FriendRequest) {
      return this.item({
        user: User.firstName,
        photo: User.avatar,
        text: 'accepted your friend request',
        date,
        onPress: () => this.redirect(id, 'UserProfile', { profileId: User.id }),
      });
    }

    return null;
  }

  comment = ({ notifiable, Notifiable, User, id, createdAt }) => {
    let type = null;
    let params = null;
    let route = null;

    if (notifiable === 'Group') {
      type = `group "${Notifiable.name}"`;
      route = 'GroupDetail';
      params = { group: Notifiable };
    }

    if (notifiable === 'Trip') {
      type = `ride ${Notifiable.TripStart.name} - ${Notifiable.TripEnd.name}`;
      if (Notifiable.tripType === 'offer') {
        route = 'OfferDetail';
        params = { offer: Notifiable };
      } else {
        route = 'AskDetail';
        params = { ask: Notifiable };
      }
    }

    return this.item({
      user: User.firstName,
      photo: User.avatar,
      text: `commented on your ${type}`,
      date: createdAt,
      onPress: () => this.redirect(id, route, params),
    });
  }

  invitation = ({ Group, Trip, User, date, id }) => {
    let type = null;
    let params = null;
    let route = null;

    if (Group) {
      type = `group "${Group.name}"`;
      route = 'GroupDetail';
      params = { group: Group };
    }

    if (Trip) {
      type = `ride "${Trip.TripStart.name} - ${Trip.TripEnd.name}"`;
      if (Trip.tripType === 'offer') {
        route = 'OfferDetail';
        params = { offer: Trip };
      } else {
        route = 'AskDetail';
        params = { ask: Trip };
      }
    }

    return this.item({
      user: User.firstName,
      photo: User.avatar,
      text: `shared a ${type}`,
      date,
      onPress: () => this.redirect(id, route, params),
    });
  }

  renderAction = (id, accept, reject) => {
    const { action } = this.state;

    if (action === 0) {
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

    if (action === 1) {
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

    if (action === 2) {
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

  renderPic = (photo) => {
    let profileImage = null;
    if (photo) {
      profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return profileImage;
  }

  render() {
    const { notification } = this.props;
    let message = null;

    if (notification.type === 'membership_request') {
      message = this.memberRequest(notification);
    }

    if (notification.type === 'membership_request_accepted') {
      message = this.membershipRequestAccepted(notification);
    }

    if (notification.type === 'comment') {
      message = this.comment(notification);
    }

    if (notification.type === 'invitation') {
      message = this.invitation(notification);
    }

    if (notification.type === 'friend_request') {
      message = this.friendRequest(notification);
    }

    if (notification.type === 'friend_request_accepted') {
      message = this.friendRequestAccepted(notification);
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
};

export default compose(
  withReadNotification,
  withRejectGroupInvitation,
  withAcceptGroupRequest,
  withAcceptFriendRequest,
  withRejectFriendRequest,
)(Item);
