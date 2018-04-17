import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import PropTypes from 'prop-types';

import { withMyGroups, withAddUnregisteredParticipants } from '@services/apollo/group';
import { withFriends, withBestFriends } from '@services/apollo/friend';
import { withContactFriends } from '@services/apollo/contact';
import { compose } from 'react-apollo';
import { Loading, RoundedButton, SearchBar } from '@components/common';
import Colors from '@theme/colors';
import FriendList from '@components/friend/selectable';
import { trans } from '@lang/i18n';
import SectionLabel from '@components/add/sectionLabel';
import ShareItem from '@components/common/shareItem';
import { connect } from 'react-redux';
import { FEEDABLE_TRIP, FEEDABLE_GROUP, FEEDABLE_EXPERIENCE } from '@config/constant';
import SendSMS from 'react-native-sms';
import { withShare, withShareLocation } from '@services/apollo/share';
import DataList from '@components/dataList';
import LoadMore from '@components/message/loadMore';
import TouchableHighlight from '@components/touchableHighlight';
import { FEEDABLE_LOCATION } from '../../config/constant';

const styles = StyleSheet.create({
  list: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 24,
    marginTop: 16,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.mutedBlue,
  },
  navBar: {
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 8,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontWeight: 'bold',
    color: Colors.text.gray,
    fontSize: 18,
  },
  map: {
    width: 54,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: Colors.background.fullWhite,
  },
  shareCategoryTitle: {
    fontSize: 12,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  header: {
    backgroundColor: Colors.background.mutedBlue,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: Colors.background.mutedBlue,
    paddingHorizontal: 20,
    elevation: 15,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  closeIcon: {
    height: 48,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { rotate: '-90deg' },
    ],
  },
});

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipboard: ['copy_to_clip'],
      social: [],
      selectedFriends: [],
      selectedContacts: [],
      selectedGroups: [],
      selectedTripParticipants: [],
      friendsList: [],
      friendsListSearch: [],
      participantsList: [],
      contactsList: [],
      contactsListSearch: [],
      searchQuery: '',
      loading: false,
    };
  }

  componentWillMount() {
    const { friends,
      defaultValue: { offeredUser, groups, friends: defaultFriends }, detail, user } = this.props;
    const { friendsList } = this.state;

    if (friends && !friends.loading) {
      friends.rows.forEach(friend => friendsList.push(friend));
    }

    if (offeredUser && Object.keys(offeredUser).length > 0) {
      this.setState({ selectedFriends: [offeredUser.id] });
    }

    if (defaultFriends) {
      this.setState({ selectedFriends: defaultFriends.map(id => id) });
    }

    if (groups) {
      this.setState({ selectedGroups: groups.map(id => id) });
    }

    if (detail && detail.Participants && detail.Participants.rows) {
      this.setState({
        participantsList: detail.Participants.rows.filter(participant =>
          user.id !== participant.id),
      });
    }

    this.setState({
      friendsList,
      selectedGroups: groups || [],
    });
  }

  componentWillReceiveProps({ contacts }) {
    if (contacts && !contacts.loading) {
      const contactsList = contacts.rows.map(contact => ({
        id: contact.phoneNumber,
        firstName: contact.name,
        lastName: '',
      }));
      this.setState({ contactsList });
    }
  }

  onNext = () => {
    const { onNext } = this.props;
    this.setState({ loading: true });
    const { social, clipboard, selectedFriends: friends, selectedGroups: groups } = this.state;
    if (typeof onNext === 'function') {
      onNext({ social, friends, groups, clipboard });
    } else {
      this.submitShare();
    }
  }

  onClose = () => {
    this.props.onClose();
  }

  onChangeSearchQuery = (searchQuery) => {
    this.setState({ searchQuery });
    const { friendsList, contactsList } = this.state;
    const friendsListSearch = friendsList.filter(
      ({ firstName, lastName }) => (((firstName + lastName)
        .toLowerCase()))
        .includes(searchQuery.toLowerCase()),
    );

    const contactsListSearch = contactsList.filter(
      contact => (((contact.firstName).toLowerCase())).includes(searchQuery.toLowerCase()),
    );

    this.setState({ friendsListSearch, contactsListSearch });
  }

  setOption = (type, value) => {
    const { defaultValue } = this.props;

    if (type === 'selectedGroups' && defaultValue.groupId === value) {
      return null;
    }

    if (type === 'selectedFriends' && defaultValue.offeredUser && defaultValue.offeredUser.id === value) {
      return null;
    }

    const data = this.state[type];
    if (data.indexOf(value) > -1) {
      data.splice(data.indexOf(value), 1);
    } else {
      data.push(value);
    }

    const obj = {};
    obj[type] = data;

    this.setState(obj);

    return true;
  }

  submitShare = async () => {
    const {
      share,
      detail,
      type,
      storeUnregisteredParticipants,
      location,
      shareLocation,
      startTrackingLocation,
    } = this.props;
    const {
      social,
      selectedFriends: friends,
      selectedGroups: groups,
      selectedContacts: contacts,
      selectedTripParticipants: tripParticipants,
    } = this.state;
    const shareInput = { social, friends, groups };
    const { name, Trip, TripStart, TripEnd, id } = detail;
    let smsBody = '';

    if (type === FEEDABLE_GROUP) {
      smsBody = `I want to share group ${name} with you.`;
    }

    if (type === FEEDABLE_TRIP) {
      smsBody = `I want to share trip ${TripStart.name} - ${TripEnd.name} with you`;
    }

    if (type === FEEDABLE_EXPERIENCE) {
      smsBody = `I want to share an experience with you between ${Trip.TripStart.name} - ${Trip.TripEnd.name}.`;
    }

    try {
      if (location.tripId) {
        if (tripParticipants.length > 0 || friends.length > 0) {
          const obj = { ...location, users: tripParticipants.concat(friends) };
          startTrackingLocation();
          await shareLocation(obj);
        } else {
          Alert.alert('You must select at least one participants.');
          this.setState({ loading: false });
          return;
        }
      } else {
        if (social.length > 0 || friends.length > 0 || groups.length > 0) {
          await share({ id, type, share: shareInput });
        }

        if (contacts.length > 0) {
          if (type === FEEDABLE_GROUP) {
            storeUnregisteredParticipants({ groupId: id, phoneNumbers: contacts });
          }

          SendSMS.send({
            body: smsBody,
            recipients: contacts,
            successTypes: ['sent', 'queued'],
          }, () => { });
        }
      }
      this.onClose();
    } catch (error) {
      this.onClose();
    }
  }

  hasOption = (type, key) => {
    const data = this.state[type];

    return data.indexOf(key) > -1;
  }

  isModal() {
    return this.props.modal;
  }

  showRideParticipants() {
    return this.props.type === FEEDABLE_LOCATION;
  }

  showGroup() {
    return this.props.type !== FEEDABLE_GROUP && this.props.type !== FEEDABLE_LOCATION;
  }

  buttonText() {
    return this.isModal() ? 'Share' : 'Next';
  }

  hasFacebook() {
    const { user } = this.props;

    return !!user.fbId;
  }

  hasTwitter() {
    const { user } = this.props;

    return !!user.twitterId;
  }

  loadMore = (onPress) => {
    const { groups } = this.props;
    if (groups.loading) return null;

    const remaining = groups.count - groups.rows.length;

    if (remaining < 1) return null;

    return (<LoadMore onPress={onPress} remainingCount={remaining} />);
  }

  renderGroups() {
    const { groups, defaultValue } = this.props;

    if (groups.rows.length === 0) {
      return null;
    }

    return (
      <View style={styles.list}>
        <Text style={styles.shareCategoryTitle}>{'Groups'.toUpperCase()}</Text>
        <DataList
          data={groups}
          renderItem={({ item }) => (
            <ShareItem
              imageSource={{ uri: item.photo || item.mapPhoto }}
              hasPhoto
              selected={this.hasOption('selectedGroups', item.id)}
              label={item.name}
              onPress={() => this.setOption('selectedGroups', item.id)}
              color="blue"
              readOnly={defaultValue.groupId === item.id}
            />
          )}
          infinityScroll={false}
          loadMoreButton={this.loadMore}
          loadMorePosition="bottom"
          fetchMoreOptions={{
            variables: { offset: groups.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.groups.rows.concat(
                fetchMoreResult.groups.rows,
              );

              return { groups: { ...previousResult.groups, ...{ rows } } };
            },
          }}
        />
      </View>
    );
  }

  renderList = () => {
    const { bestFriends, friends, defaultValue: { offeredUser } } = this.props;
    const {
      friendsListSearch,
      contactsListSearch,
      participantsList,
      selectedContacts,
      selectedFriends,
      selectedTripParticipants,
      friendsList,
      contactsList,
      searchQuery,
    } = this.state;

    if (searchQuery.length > 0) {
      return (
        <View style={styles.listWrapper}>
          <FriendList
            title="Your Friends"
            loading={friends.loading}
            rows={friendsListSearch}
            setOption={id => this.setOption('friends', id)}
            selected={selectedFriends}
            readOnlyUserId={offeredUser ? offeredUser.id : null}
          />
          <FriendList
            loading={friends.loading}
            rows={contactsListSearch}
            defaultAvatar
            setOption={id => this.setOption('contacts', id)}
            selected={selectedContacts}
          />
        </View>
      );
    }

    return (
      <View style={styles.listWrapper}>
        {offeredUser && Object.keys(offeredUser).length > 0 &&
          <ShareItem
            readOnly
            imageSource={{ uri: offeredUser.avatar }}
            label={offeredUser.firstName}
            onPress={() => { }}
            color="blue"
            selected
            hasPhoto
          />
        }
        {this.showRideParticipants() &&
          <FriendList
            title="PARTICIPANTS IN THIS RIDE"
            rows={participantsList}
            defaultAvatar
            setOption={id => this.setOption('selectedTripParticipants', id)}
            selected={selectedTripParticipants}
          />
        }
        {!this.isModal() &&
          <ShareItem
            readOnly
            selected={this.hasOption('social', 'publish_to_whole_movement')}
            label={trans('global.publish_to_whole_movement')}
            onPress={() => { }}
            color="blue"
          />
        }
        <ShareItem
          imageSource={require('@assets/icons/ic_copy.png')}
          selected={this.hasOption('clipboard', 'copy_to_clip')}
          label={trans('global.copy_to_clipboard')}
          onPress={() => this.setOption('clipboard', 'copy_to_clip')}
          color="blue"
        />
        {this.hasFacebook() &&
          <ShareItem
            imageSource={require('@assets/icons/ic_facebook.png')}
            selected={this.hasOption('social', 'Facebook')}
            label={trans('global.your_fb_timeline')}
            onPress={() => this.setOption('social', 'Facebook')}
            color="blue"
          />}
        {this.hasTwitter() &&
          <ShareItem
            imageSource={require('@assets/icons/ic_twitter.png')}
            selected={this.hasOption('social', 'Twitter')}
            label={trans('global.tweet')}
            onPress={() => this.setOption('social', 'Twitter')}
            color="blue"
          />}
        <FriendList
          title="Recent"
          loading={bestFriends.loading}
          rows={bestFriends.rows}
          setOption={id => this.setOption('selectedFriends', id)}
          selected={selectedFriends}
        />
        {this.showGroup() && this.renderGroups()}
        <FriendList
          title="Your Friends"
          loading={friends.loading}
          rows={friendsList}
          setOption={id => this.setOption('selectedFriends', id)}
          selected={selectedFriends}
          readOnlyUserId={offeredUser ? offeredUser.id : null}
        />
        {!this.showRideParticipants() &&
          <FriendList
            loading={friends.loading}
            rows={contactsList}
            defaultAvatar
            setOption={id => this.setOption('selectedContacts', id)}
            selected={selectedContacts}
          />
        }
      </View>);
  }

  renderButton = () => {
    const { loading } = this.state;
    const { type, location } = this.props;
    let duration = '';

    if ((location.duration / 60) < 1) duration = `${location.duration} minutes`;
    if ((location.duration / 60) >= 1) duration = `${location.duration / 60} hours`;

    if (loading) {
      return (<Loading />);
    }

    let buttonText = trans('global.share');
    if (type === FEEDABLE_GROUP) buttonText = trans('global.add_and_publish_button');
    if (type === FEEDABLE_LOCATION) buttonText = `${trans('global.share_location_for')} ${duration}`;

    return (
      <RoundedButton
        onPress={this.onNext}
        bgColor={Colors.background.pink}
        style={styles.button}
      >
        {buttonText}
      </RoundedButton>
    );
  }

  render() {
    const { labelColor, type } = this.props;

    let sectionLabel = trans('global.invite_and_publish');
    if (type === FEEDABLE_GROUP) sectionLabel = trans('global.add_and_publish');
    if (type === FEEDABLE_LOCATION) sectionLabel = trans('global.share_live_location_with');

    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          {
            this.isModal() &&
            <View style={styles.navBar}>
              <View style={styles.iconWrapper}>
                <TouchableHighlight
                  style={styles.closeIcon}
                  onPress={this.onClose}
                >
                  <View style={styles.icon}>
                    <Image source={require('@assets/icons/ic_back.png')} />
                  </View>
                </TouchableHighlight>
              </View>
              <Text style={styles.pageTitle} >{trans('global.share_with')}</Text>
              <View style={styles.map} />
            </View>
          }
          {!this.isModal() &&
            <SectionLabel label={sectionLabel} color={labelColor} />
          }
          <SearchBar
            placeholder="Search contacts"
            onChange={this.onChangeSearchQuery}
            defaultValue={this.state.searchQuery}
            onPressClose={() => this.setState({ searchQuery: '' })}
          />
        </View>
        <ScrollView>
          {this.renderList()}
        </ScrollView>
        <View style={styles.footer}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

Share.propTypes = {
  share: PropTypes.func.isRequired,
  detail: PropTypes.shape({
    id: PropTypes.number,
  }),
  location: PropTypes.shape(),
  shareLocation: PropTypes.func,
  type: PropTypes.oneOf([FEEDABLE_GROUP, FEEDABLE_TRIP, FEEDABLE_EXPERIENCE, FEEDABLE_LOCATION]),
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  groups: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  modal: PropTypes.bool,
  friends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  bestFriends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  contacts: PropTypes.shape({
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  labelColor: PropTypes.string,
  user: PropTypes.shape({
    fbId: PropTypes.string,
    twitterId: PropTypes.string,
  }).isRequired,
  defaultValue: PropTypes.shape({
    groups: PropTypes.array,
    offeredUser: PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
  storeUnregisteredParticipants: PropTypes.func.isRequired,
  startTrackingLocation: PropTypes.func,
};

Share.defaultProps = {
  onClose: () => { },
  modal: false,
  type: '',
  labelColor: Colors.text.pink,
  onNext: null,
  detail: null,
  defaultValue: { groups: [], offeredUser: {} },
  location: {},
  shareLocation: null,
  startTrackingLocation: null,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyGroups,
  withBestFriends,
  withFriends,
  withContactFriends,
  withShare,
  withShareLocation,
  withAddUnregisteredParticipants,
  connect(mapStateToProps))(Share);
