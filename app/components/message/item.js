import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { withReadNotification, withRejectGroupInvitation, withAcceptGroupRequest } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

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
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

class Item extends PureComponent {
  rejectGroupRequest = (id) => {
    const { rejectGroupInvitation, notification } = this.props;
    rejectGroupInvitation(id).then(notification.refetch).catch(console.error);
  }

  acceptGroupRequest = (id) => {
    const { acceptGroupRequest, notification } = this.props;
    acceptGroupRequest(id).then(notification.refetch).catch(console.error);
  }

  redirect = (id, route, params) => {
    const { navigation, filters, notification, markRead } = this.props;

    if (filters === 'new') {
      markRead(id).then(notification.refetch);
    }

    navigation.navigate(route, params);
  }

  requestJoinGroup = ({ User, GroupMembershipRequest }) => (
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {this.renderPic(User.photo)}
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
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => this.acceptGroupRequest(GroupMembershipRequest.id)}
          style={styles.accept}
        >
          <Icon
            name="ios-checkmark-circle-outline"
            size={32}
            color={Colors.text.blue}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.rejectGroupRequest(GroupMembershipRequest.id)}
        >
          <Icon
            name="ios-close-circle-outline"
            size={32}
            color={Colors.text.red}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  item = ({ user, photo, text, date, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {this.renderPic(photo)}
          </View>
          <View>
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
          <Text style={[styles.time, styles.bold]}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  memberRequest = ({ GroupMembershipRequest, User, date, id }) => {
    if (GroupMembershipRequest && GroupMembershipRequest.status === 'pending') {
      return this.requestJoinGroup({ User, GroupMembershipRequest });
    }

    if (GroupMembershipRequest && GroupMembershipRequest.status === 'accepted') {
      return this.item({
        photo: User.photo,
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
        photo: User.photo,
        text: `accepted your request to join group "${Group.name}"`,
        date,
        onPress: () => this.redirect(id, 'GroupDetail', { group: Group }),
      });
    }

    return null;
  }

  comment = ({ Group, Trip, User, date, id }) => {
    let type = null;
    let params = null;
    let route = null;

    if (Group) {
      type = `group "${Group.name}"`;
      route = 'GroupDetail';
      params = { group: Group };
    }

    if (Trip) {
      type = `ride ${Trip.TripStart.name} - ${Trip.TripEnd.name}`;
      if (Trip.type === 'offer') {
        route = 'OfferDetail';
        params = { offer: Trip };
      } else {
        route = 'AskDetail';
        params = { ask: Trip };
      }
    }

    return this.item({
      user: User.firstName,
      photo: User.photo,
      text: `commented on your ${type}`,
      date,
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
      if (Trip.type === 'offer') {
        route = 'OfferDetail';
        params = { offer: Trip };
      } else {
        route = 'AskDetail';
        params = { ask: Trip };
      }
    }

    return this.item({
      user: User.firstName,
      photo: User.photo,
      text: `shared a ${type}`,
      date,
      onPress: () => this.redirect(id, route, params),
    });
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
};

export default compose(
  withReadNotification,
  withRejectGroupInvitation,
  withAcceptGroupRequest)(Item);
