import React, { Component } from 'react';
import { StyleSheet, Modal, View, ScrollView, Platform, PermissionsAndroid, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { compose } from 'react-apollo';
import { Wrapper, ConfirmModal, RoundedButton, SearchBar } from '@components/common';
import Toolbar from '@components/utils/toolbar';
import { withAddGroupParticipant, withAddUnregisteredParticipants } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';
import { withUnlimitedFriends } from '@services/apollo/friend';
import { withContactFriends } from '@services/apollo/contact';
import FriendList from '@components/friend/selectable';
import SendSMS from 'react-native-sms';
import { trans } from '@lang/i18n';
import Toast from '@components/toast';
import { getToast } from '@config/toast';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
});

class AddParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmModalVisibility: false,
      participants: [],
      selectedFriends: [],
      selectedContacts: [],
      contactsList: [],
      contactsListSearch: [],
      searchQuery: '',
      loading: false,
      error: '',
      friendsList: [],
      friendsListSearch: [],
    };
    this.friendsQueryCalled = false;
  }

  componentWillMount() {
    const { friends } = this.props;
    const { friendsList } = this.state;

    if (friends && !friends.loading) {
      friends.rows.forEach(friend => friendsList.push(friend));
    }

    this.setState({ friendsList });
  }

  componentWillReceiveProps({ contacts, friends }) {
    const contactsList = [];
    if (contacts && !contacts.loading) {
      contacts.rows.forEach((contact) => {
        contactsList.push({
          id: contact.phoneNumber,
          firstName: contact.name,
          lastName: '',
        });
      });
      this.setState({ contactsList });
    }

    const friendsList = [];

    if (!this.friendsQueryCalled) {
      this.friendsQueryCalled = true;
      friends.fetchMore({
        variables: {
          groupId: this.props.group.id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            friends: { ...fetchMoreResult.friends },
          };
        },
      });
    }


    if (friends && !friends.loading) {
      friends.rows.forEach(friend => friendsList.push(friend));
      this.setState({ friendsList });
    }
  }

  onChangeSearchQuery = (searchQuery) => {
    this.setState({ searchQuery });
    const { contactsList, friendsList } = this.state;

    const contactsListSearch = contactsList.filter(
      contact => (((contact.firstName).toLowerCase())).includes(searchQuery.toLowerCase()),
    );

    const friendsListSearch = friendsList.filter(
      friend => (
        friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    );

    this.setState({ contactsListSearch, friendsListSearch });
  }

  onAdd = () => {
    const { addGroupParticipant, group, navigation, storeUnregisteredParticipants } = this.props;
    const { selectedFriends, selectedContacts } = this.state;
    this.setState({ loading: true });

    addGroupParticipant({ groupId: group.id, ids: selectedFriends })
      .then(() => {
        if (selectedContacts.length > 0) {
          storeUnregisteredParticipants({ groupId: group.id, phoneNumbers: selectedContacts })
            .then(async () => {
              if (Platform.OS === 'android') {
                const permission = await PermissionsAndroid
                  .check(PermissionsAndroid.PERMISSIONS.READ_SMS);

                if (!permission) {
                  const status = await PermissionsAndroid
                    .request(PermissionsAndroid.PERMISSIONS.READ_SMS);

                  if (status === 'granted') {
                    this.sendSMS(group.name, selectedContacts);
                  } else {
                    Alert.alert(trans('share.allow_sms_permission'));
                  }
                } else {
                  this.sendSMS(group.name, selectedContacts);
                }
              } else {
                this.sendSMS(group.name, selectedContacts);
              }
            }).catch(() => this.setState({ loading: false, confirmModalVisibility: false }));
        } else {
          navigation.goBack();
        }
        this.setConfirmModalVisibility(false);
        this.setState({ loading: false });
      }).catch(() => this.setState({ loading: false, confirmModalVisibility: false }));
  }

  setConfirmModalVisibility = (show) => {
    const { selectedContacts, selectedFriends } = this.state;
    const totalFriends = selectedFriends + selectedContacts;

    if (show) {
      if (totalFriends < 1) {
        this.setState({ error: getToast(['SELECT_ONE_USER']) });
      } else {
        this.setState({ error: '', confirmModalVisibility: true });
      }
    } else {
      this.setState({ confirmModalVisibility: false, error: '' });
    }
  }

  setOption = (type, value) => {
    const data = this.state[type];

    if (data.indexOf(value) > -1) {
      data.splice(data.indexOf(value), 1);
    } else {
      data.push(value);
    }

    const obj = {};
    obj[type] = data;
    this.setState(obj);
  }

  sendSMS = (name, selectedContacts) => {
    SendSMS.send({
      body: `I would like to invite you to ${name} group`,
      recipients: selectedContacts,
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  renderButton = () => (
    <RoundedButton
      onPress={() => this.setConfirmModalVisibility(true)}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      {trans('global.add')}
    </RoundedButton>
  );

  renderModal() {
    const { confirmModalVisibility, loading, selectedFriends, selectedContacts } = this.state;
    const totalFriends = selectedContacts.length + selectedFriends.length;

    const message = (
      <AppText>
        {trans('group.are_you_sure_you_want_to_add')} {totalFriends > 1 ? `${totalFriends} ${trans('global.friends')}` : ''}?
      </AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={this.onAdd}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderList() {
    const { friends } = this.props;
    const {
      searchQuery,
      selectedContacts,
      contactsList,
      contactsListSearch,
      friendsList,
      friendsListSearch,
      selectedFriends,
    } = this.state;

    if (searchQuery.length > 0) {
      return (
        <View style={styles.listWrapper}>
          <FriendList
            loading={friends.loading}
            rows={friendsListSearch}
            setOption={id => this.setOption('selectedFriends', id)}
            selected={selectedFriends}
          />
          <FriendList
            loading={false}
            rows={contactsListSearch}
            defaultAvatar
            setOption={id => this.setOption('selectedContacts', id)}
            selected={selectedContacts}
          />
        </View>
      );
    }

    return (
      <View style={styles.listWrapper}>
        <FriendList
          loading={friends.loading}
          rows={friendsList}
          setOption={id => this.setOption('selectedFriends', id)}
          selected={selectedFriends}
        />
        <FriendList
          rows={contactsList}
          defaultAvatar
          setOption={id => this.setOption('selectedContacts', id)}
          selected={selectedContacts}
        />
      </View>
    );
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => { }}
        visible
      >
        <Wrapper>
          <Toolbar title={trans('group.add_participants')} />
          <Toast message={this.state.error} type="error" />
          <ScrollView>
            <SearchBar
              placeholder={trans('global.search')}
              onChange={this.onChangeSearchQuery}
              defaultValue={this.state.searchQuery}
              onPressClose={() => this.setState({ searchQuery: '' })}
              style={{ marginVertical: 32 }}
            />
            {this.renderList()}
          </ScrollView>
          <View style={styles.footer}>
            {this.renderButton()}
          </View>
          {this.renderModal()}
        </Wrapper>
      </Modal>
    );
  }
}

AddParticipant.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  addGroupParticipant: PropTypes.func.isRequired,
  contacts: PropTypes.shape({
    loading: PropTypes.bool,
    rows: PropTypes.array,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  storeUnregisteredParticipants: PropTypes.func.isRequired,
  friends: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default compose(
  withNavigation,
  withAddGroupParticipant,
  withContactFriends,
  withAddUnregisteredParticipants,
  withUnlimitedFriends,
)(AddParticipant);
