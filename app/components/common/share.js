import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Clipboard, Platform, PermissionsAndroid } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withMyGroups, withAddUnregisteredParticipants } from '@services/apollo/group';
import { withBestFriends, withUnlimitedFriends } from '@services/apollo/friend';
import { withContactFriends } from '@services/apollo/contact';
import { compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loading, RoundedButton, SearchBar, SocialMediaLinkModal } from '@components/common';
import Colors from '@theme/colors';
import FriendList from '@components/friend/selectable';
import { trans } from '@lang/i18n';
import SectionLabel from '@components/add/sectionLabel';
import ShareItem from '@components/common/shareItem';
import WithFilteredGroups from '@components/group/withFilteredGroups';
import { FEEDABLE_TRIP, FEEDABLE_GROUP, FEEDABLE_EXPERIENCE, FEEDABLE_LOCATION, GROUP_FEED_TYPE_SHARE, GROUP_SHARED } from '@config/constant';
import SendSMS from 'react-native-sms';
import { withShare, withShareLocation } from '@services/apollo/share';
import DataList from '@components/dataList';
import LoadMore from '@components/message/loadMore';
import TouchableHighlight from '@components/touchableHighlight';
import { Heading, AppText } from '@components/utils/texts';
import { APP_URL } from '@config';
import FBShare from '@services/facebook/share';

const FilteredGroups = withMyGroups(WithFilteredGroups);

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
    marginHorizontal: 24,
    marginBottom: 12,
  },
  header: {
    backgroundColor: Colors.background.mutedBlue,
  },
  shadow: {
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.mutedBlue,
    paddingHorizontal: 20,
    elevation: 15,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  button: {
    flex: 0,
    width: 200,
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
      error: false,
      connectFbModal: false,
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

    if (this.hasFacebook()) this.setOption('social', 'Facebook');
    if (this.hasTwitter()) this.setOption('social', 'Twitter');

    this.setState({
      friendsList,
    });
  }

  componentWillReceiveProps({ contacts, friends }) {
    if (contacts && contacts.rows && !contacts.loading) {
      const contactsList = contacts.rows.map(contact => ({
        id: contact.phoneNumber,
        firstName: contact.name,
        lastName: '',
      }));
      this.setState({ contactsList });
    }
    const friendsList = [];
    if (friends && !friends.loading) {
      friends.rows.forEach(friend => friendsList.push(friend));
      this.setState({ friendsList });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.contacts && nextProps.contacts.loading) return false;
    if (nextProps.bestFriends && nextProps.bestFriends.loading) return false;
    if (nextProps.groups && nextProps.groups.loading) return false;
    if (nextProps.friends && nextProps.friends.loading) return false;

    return true;
  }

  onNext = () => {
    const { onNext, detail } = this.props;
    this.setState({ loading: true });
    const {
      social,
      clipboard,
      selectedFriends: friends,
      selectedGroups: groups,
      selectedContacts: contacts,
    } = this.state;

    if (typeof onNext === 'function') {
      onNext({ social, friends, groups, clipboard, contacts });
    } else {
      const { url } = detail;
      Clipboard.setString(url || '');
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

  setFacebook = () => {
    if (!this.hasFacebook()) {
      this.setState({ connectFbModal: true });
    }
    this.setOption('social', 'Facebook');
  }

  setTwitter = () => {
    if (!this.hasTwitter()) {
      this.setState({ connectTwitterModal: true });
    }
    this.setOption('social', 'Twitter');
  }

  setFacebookConnection = (connection) => {
    if (!connection && !this.hasFacebook()) {
      this.setOption('social', 'Facebook');
    }

    this.setState({ connectFbModal: false });
  }

  setTwitterConnection = (connection) => {
    if (!connection && !this.hasTwitter()) {
      this.setOption('social', 'Twitter');
    }

    this.setState({ connectTwitterModal: false });
  }

  getSmsText = async () => {
    const { detail, type } = this.props;

    const { name, TripStart, TripEnd, id, Trip, direction } = detail;
    let smsBody = '';

    try {
      if (type === FEEDABLE_GROUP) {
        smsBody = trans('share.share_group', { name, url: `${APP_URL}/g/${id}` });
      }

      if (type === FEEDABLE_TRIP) {
        smsBody = trans('share.share_trip',
          { tripStart: TripStart.name || direction, tripEnd: TripEnd.name || direction, url: `${APP_URL}/t/${id}` },
        );
      }

      if (type === FEEDABLE_EXPERIENCE) {
        smsBody = trans(
          'share.share_experience',
          { tripStart: Trip ? Trip.TripStart.name : '', tripEnd: Trip ? Trip.TripEnd.name : '', url: `${APP_URL}/e/${id}` },
        );
      }

      if (type === FEEDABLE_LOCATION) {
        const url = await Clipboard.getString();
        smsBody = trans(
          'share.share_location',
          {
            tripStart: TripStart.name || direction,
            tripEnd: TripEnd.name || direction,
            url,
          },
        );
      }

      return smsBody;
    } catch (err) {
      return '';
    }
  }

  getTwitterText = () => {
    const { type, defaultValue: { offeredUser } } = this.props;
    if (this.hasTwitter() && type === FEEDABLE_TRIP && offeredUser && offeredUser.twitterUsername) {
      return trans('global.tweet_to', { twitterUsername: offeredUser.twitterUsername });
    }

    return trans('global.tweet');
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
      user,
    } = this.props;
    const {
      clipboard,
      social,
      selectedFriends: friends,
      selectedGroups: groups,
      selectedContacts: contacts,
      selectedTripParticipants: tripParticipants,
    } = this.state;
    const shareInput = { social, friends, groups };
    const { id, isAdmin } = detail;

    if (
      type === FEEDABLE_LOCATION &&
      clipboard.length < 1 &&
      social.length < 1 &&
      friends < 1 &&
      groups < 1 &&
      contacts < 1 &&
      tripParticipants < 1
    ) {
      Alert.alert(trans('share.select_at_least_one_option'));
      this.setState({ loading: false });
      return;
    }

    try {
      if (location.tripId) {
        // if (tripParticipants.length > 0 || friends.length > 0) {
        const obj = { ...location, users: tripParticipants.concat(friends) };
        startTrackingLocation();
        await shareLocation(obj).then(async ({ data }) => {
          const { shareLocation: sharedLocation } = data;
          if (sharedLocation && sharedLocation.Location) {
            Clipboard.setString(data.shareLocation.Location.url);
            if (social.length > 0) {
              if (social.includes('Facebook')) FBShare.link(type, data.shareLocation.Location);
              if (social.includes('Twitter') || friends.length > 0) {
                await share({ id: sharedLocation.Location.id, type, share: shareInput });
              }
            }
          }
        });
        // } else {
        //   Alert.alert(trans('share.select_at_least_one_participant'));
        //   this.setState({ loading: false });
        //   return;
        // }
      } else if (social.length > 0 || friends.length > 0 || groups.length > 0) {
        if (social.includes('Facebook')) {
          let shareType = type;
          if (type === FEEDABLE_GROUP && user.id !== detail.User.id) {
            shareType = GROUP_SHARED;
          }

          if (Platform.OS === 'ios') {
            setTimeout(() => {
              FBShare.link(shareType, detail);
            }, 1000);
          } else {
            FBShare.link(shareType, detail);
          }
        }
        await share({ id, type, share: shareInput });
      }

      if (contacts.length > 0) {
        const smsBody = await this.getSmsText();

        if (type === FEEDABLE_GROUP && isAdmin) {
          storeUnregisteredParticipants({ groupId: id, phoneNumbers: contacts });
        }

        if (Platform.OS === 'android') {
          const permission = await PermissionsAndroid
            .check(PermissionsAndroid.PERMISSIONS.READ_SMS);

          if (!permission) {
            const status = await PermissionsAndroid
              .request(PermissionsAndroid.PERMISSIONS.READ_SMS);

            if (status === 'granted') {
              this.sendSMS(smsBody, contacts);
            } else {
              Alert.alert(trans('share.allow_sms_permission'));
            }
          } else {
            this.sendSMS(smsBody, contacts);
          }
        } else {
          setTimeout(() => this.sendSMS(smsBody, contacts), 1000);
        }
      }

      this.onClose();
    } catch (error) {
      let shareType = '';
      if (type === FEEDABLE_GROUP) shareType = 'group';
      if (type === FEEDABLE_TRIP) shareType = 'trip';
      if (type === FEEDABLE_EXPERIENCE) shareType = 'experience';
      if (type === FEEDABLE_LOCATION) shareType = 'location';

      this.setState({ error: trans('share.failed_to_share', { type: shareType }), loading: false });
    }
  }

  sendSMS = (body, recipients) => {
    SendSMS.send({
      body,
      recipients,
      successTypes: ['sent', 'queued'],
    }, () => { });
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

  renderConnectFBModal = () => {
    const { connectFbModal } = this.state;
    if (!connectFbModal) return null;

    const message = (
      <AppText>
        {trans('share.link_facebook')}
      </AppText>
    );

    return (
      <SocialMediaLinkModal
        visible={connectFbModal}
        onRequestClose={() => this.setFacebookConnection(false)}
        message={message}
        denyLabel={trans('global.no')}
        onConfirm={() => this.setFacebookConnection(true)}
        onDeny={() => this.setFacebookConnection(false)}
        confrimTextColor={Colors.text.blue}
        media="Facebook"
      />
    );
  }

  renderConnectTwitterModal = () => {
    const { connectTwitterModal } = this.state;
    if (!connectTwitterModal) return null;

    const message = (
      <AppText>
        {trans('share.link_twitter')}
      </AppText>
    );

    return (
      <SocialMediaLinkModal
        visible={connectTwitterModal}
        onRequestClose={() => this.setTwitterConnection(false)}
        message={message}
        denyLabel={trans('global.no')}
        onConfirm={() => this.setTwitterConnection(true)}
        onDeny={() => this.setTwitterConnection(false)}
        confrimTextColor={Colors.text.blue}
        media="Twitter"
      />
    );
  }

  renderGroups() {
    const { groups, defaultValue } = this.props;

    if (groups.rows.length === 0) {
      return null;
    }

    return (
      <View style={styles.list}>
        <AppText size={12} color={Colors.text.blue} style={styles.shareCategoryTitle}>{'Groups'.toUpperCase()}</AppText>
        <DataList
          keyboardShouldPersistTaps="always"
          data={groups}
          renderItem={({ item }) => (
            <ShareItem
              imageURI={item.photo || item.mapPhoto}
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
    const { bestFriends, friends, defaultValue: { offeredUser, groupId } } = this.props;
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
          {
            <FilteredGroups
              queryString={searchQuery}
              applyQueryString
              filterByName
              render={groups => (
                <View>
                  <AppText size={12} color={Colors.text.blue} style={styles.shareCategoryTitle}>
                    {'Groups'.toUpperCase()}
                  </AppText>
                  {groups.map(group => (
                    <ShareItem
                      key={group.id}
                      imageSource={{ uri: group.photo || group.mapPhoto }}
                      hasPhoto
                      selected={this.hasOption('selectedGroups', group.id)}
                      label={group.name}
                      onPress={() => this.setOption('selectedGroups', group.id)}
                      color="blue"
                      readOnly={groupId === group.id}
                    />
                  ))}
                </View>
              )}
            />
          }
          {
            (friendsListSearch.length > 0 || contactsListSearch.length > 0) && <View>
              <AppText size={12} color={Colors.text.blue} style={[styles.shareCategoryTitle, { marginTop: 24 }]}>
                {'Your Friends'.toUpperCase()}
              </AppText>
              <FriendList
                loading={friends.loading}
                rows={friendsListSearch}
                setOption={id => this.setOption('selectedFriends', id)}
                selected={selectedFriends}
                readOnlyUserId={offeredUser ? offeredUser.id : null}
              />
              <FriendList
                loading={friends.loading}
                rows={contactsListSearch}
                defaultAvatar
                fromContact
                setOption={id => this.setOption('selectedContacts', id)}
                selected={selectedContacts}
              />
            </View>
          }
        </View>
      );
    }

    return (
      <View style={styles.listWrapper}>
        {offeredUser && Object.keys(offeredUser).length > 0 &&
          <ShareItem
            readOnly
            imageURI={offeredUser.avatar}
            label={offeredUser.firstName}
            onPress={() => { }}
            color="blue"
            selected
          />
        }
        {this.showRideParticipants() &&
          <FriendList
            title={trans('global.participants_in_this_ride')}
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
            isStatic
            label={trans('global.publish_to_whole_movement')}
            onPress={() => { }}
            color="blue"
          />
        }
        <ShareItem
          imageURI={require('@assets/icons/ic_copy.png')}
          isStatic
          selected={this.hasOption('clipboard', 'copy_to_clip')}
          label={trans('global.copy_to_clipboard')}
          onPress={() => this.setOption('clipboard', 'copy_to_clip')}
          color="blue"
        />
        {/* {this.hasFacebook() && */}
        <ShareItem
          imageURI={require('@assets/icons/ic_facebook.png')}
          isStatic
          selected={this.hasOption('social', 'Facebook')}
          label={trans('global.your_fb_timeline')}
          onPress={() => this.setFacebook()}
          color="blue"
        />
        {/* } */}
        {/* {this.hasTwitter() && */}
        <ShareItem
          imageURI={require('@assets/icons/ic_twitter.png')}
          isStatic
          selected={this.hasOption('social', 'Twitter')}
          label={this.getTwitterText()}
          onPress={() => this.setTwitter()}
          color="blue"
        />
        {/* } */}
        <FriendList
          title={trans('global.recent')}
          loading={bestFriends.loading}
          rows={bestFriends.rows}
          setOption={id => this.setOption('selectedFriends', id)}
          selected={selectedFriends}
        />
        {this.showGroup() && this.renderGroups()}
        <FriendList
          title={trans('global.your_friends')}
          loading={friends.loading}
          rows={friendsList}
          setOption={id => this.setOption('selectedFriends', id)}
          selected={selectedFriends}
          readOnlyUserId={offeredUser ? offeredUser.id : null}
        />
        {/* {!this.showRideParticipants() && */}
        <FriendList
          loading={friends.loading}
          rows={contactsList}
          defaultAvatar
          isStatic
          setOption={id => this.setOption('selectedContacts', id)}
          selected={selectedContacts}
        />
        {/* } */}
      </View>);
  }

  renderButton = () => {
    const { loading, error } = this.state;
    const { type, location } = this.props;
    let { buttonText } = this.props;
    let duration = '';

    if ((location.duration / 60) < 1) duration = `${location.duration} minutes`;
    if ((location.duration / 60) >= 1) duration = `${location.duration / 60} hours`;

    if (loading) {
      return (<Loading />);
    }

    if (type === FEEDABLE_LOCATION) buttonText += ` ${duration}`;

    if (error) {
      buttonText = trans('global.retry');
    }

    // let buttonText = trans('global.share');
    // if (type === FEEDABLE_GROUP) buttonText = trans('global.add_and_publish_button');

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
    const { labelColor, type, searchInputFocused, onInputStateChange } = this.props;
    const headerShadow = this.isModal() ? styles.shadow : {};

    let sectionLabel = trans('global.invite_and_publish');
    if (type === FEEDABLE_GROUP) sectionLabel = trans('global.add_and_publish');
    if (type === FEEDABLE_LOCATION) sectionLabel = trans('global.share_live_location_with');

    return (
      <View style={styles.wrapper}>
        <View style={[styles.header, headerShadow]}>
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
              <Heading size={18} fontVariation="bold" color={Colors.text.gray}>{trans('global.share_with')}</Heading>
              <View style={styles.map} />
            </View>
          }
          {!this.isModal() && !searchInputFocused &&
            <SectionLabel label={sectionLabel} color={labelColor} />
          }
          <SearchBar
            placeholder={trans('global.search')}
            onChange={this.onChangeSearchQuery}
            defaultValue={this.state.searchQuery}
            onFocus={onInputStateChange}
            onBlur={onInputStateChange}
            onPressClose={() => this.setState({ searchQuery: '' })}
          />
        </View>
        <ScrollView keyboardShouldPersistTaps="always">
          {this.renderList()}
        </ScrollView>
        <View style={styles.footer}>
          {
            this.state.error && this.state.error !== '' && <View style={styles.errorWrapper}>
              <Icon
                name="md-sad"
                size={20}
                style={{ color: Colors.text.gray }}
              />
              <AppText
                size={14}
                color={Colors.text.gray}
                style={{ marginLeft: 4 }}
              >
                {this.state.error}
              </AppText>
            </View>
          }
          {this.renderButton()}
        </View>
        {this.renderConnectFBModal()}
        {this.renderConnectTwitterModal()}
      </View>
    );
  }
}

Share.propTypes = {
  share: PropTypes.func.isRequired,
  searchInputFocused: PropTypes.bool,
  onInputStateChange: PropTypes.func,
  detail: PropTypes.shape({
    id: PropTypes.number,
  }),
  location: PropTypes.shape(),
  shareLocation: PropTypes.func,
  type: PropTypes.oneOf(
    [FEEDABLE_GROUP, FEEDABLE_TRIP, FEEDABLE_EXPERIENCE, FEEDABLE_LOCATION, GROUP_FEED_TYPE_SHARE],
  ),
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  groups: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  modal: PropTypes.bool,
  friends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  bestFriends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  contacts: PropTypes.shape({
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    loading: PropTypes.bool,
  }).isRequired,
  labelColor: PropTypes.string,
  user: PropTypes.shape({
    fbId: PropTypes.string,
    twitterId: PropTypes.string,
    id: PropTypes.number,
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
  buttonText: PropTypes.string,
};

Share.defaultProps = {
  searchInputFocused: false,
  onInputStateChange: () => { },
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
  buttonText: trans('global.share'),
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyGroups,
  withBestFriends,
  withUnlimitedFriends,
  withContactFriends,
  withShare,
  withShareLocation,
  withAddUnregisteredParticipants,
  connect(mapStateToProps))(Share);
