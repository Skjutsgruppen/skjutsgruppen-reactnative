import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';
import { withUnfriend } from '@services/apollo/friend';
import { ConfirmModal, ListSearchBar } from '@components/common';
import ListSearchModal from '@components/profile/ListSearchModal';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';

import { AppText } from '@components/utils/texts';

class UserFriendsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmModalVisibility: false,
      friend: {},
      loading: false,
      refetch: null,
      error: null,
      isSearchModalOpen: false,
      unfriend: false,
    };
  }

  componentWillMount() {
    const { id, subscribeToNewFriend } = this.props;
    subscribeToNewFriend({ userId: id });
  }

  componentWillReceiveProps({ friends }) {
    const { loading, refetch } = friends;
    if (!loading) {
      this.setState({ loading, refetch });
    }
  }

  onSearchPress = () => {
    this.setState({ isSearchModalOpen: true });
  };

  onClose = () => {
    this.setState({ isSearchModalOpen: false });
  }

  onPress = (userId) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('Profile', { profileId: userId });
  }

  setConfirmModalVisibility = (visibility) => {
    this.setState({ confirmModalVisibility: visibility, error: null });
  }

  handleRemovePress = (friend) => {
    this.setConfirmModalVisibility(true);
    this.setState({ friend });
  }

  removeFriend = () => {
    const { unfriend } = this.props;
    const { friend, refetch } = this.state;

    this.setState({ loading: true }, () => {
      unfriend(friend.id)
        .then(() => this.setState({ loading: false, unfriend: true }))
        .then(() => this.setState({ unfriend: false }))
        .then(() => this.setConfirmModalVisibility(false))
        .then(refetch)
        .catch(error => this.setState({ loading: false, error }));
    });
  }

  renderModal() {
    const { confirmModalVisibility, friend, loading, error } = this.state;
    const message = (
      <AppText>
        {trans('profile.are_you_sure_you_want_to_remove')}
        <AppText fontVariation="bold"> {friend.firstName} {friend.lastName} </AppText>
        {trans('profile.from_your_friends_list')}
      </AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={error !== null ? trans('global.retry') : trans('profile.yes')}
        denyLabel={trans('global.no')}
        onConfirm={this.removeFriend}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderListSearch = () => {
    const { friends } = this.props;

    if (friends.count > 0) {
      return (<ListSearchBar onSearchPress={this.onSearchPress} />);
    }

    return null;
  }

  renderSearchModal = () => {
    const { id } = this.props;

    return (
      <Modal
        visible={this.state.isSearchModalOpen}
        onRequestClose={() => this.setState({ isSearchModalOpen: false })}
        animationType="slide"
      >
        <ListSearchModal
          id={id}
          onPress={this.onPress}
          onClose={this.onClose}
          searchCategory="friends"
          handleRemovePress={this.handleRemovePress}
          unfriend={this.state.unfriend}
        />
      </Modal>
    );
  }

  render() {
    const { friends, id, user } = this.props;

    return (
      <View>
        <DataList
          data={friends}
          header={this.renderListSearch}
          renderItem={({ item }) => (
            <Friends
              key={item.id}
              removeFriendOption={id === user.id}
              friend={item}
              onPress={this.onPress}
              handleRemovePress={(friend) => { this.handleRemovePress(friend); }}
              error={this.state.error}
            />
          )}
          fetchMoreOptions={{
            variables: { offset: friends.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.friends.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.friends.rows.concat(fetchMoreResult.friends.rows);

              return { friends: { ...previousResult.friends, ...{ rows } } };
            },
          }}
        />
        {this.renderModal()}
        {this.renderSearchModal()}
      </View>
    );
  }
}

UserFriendsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  friends: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  unfriend: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  subscribeToNewFriend: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, withUnfriend, connect(mapStateToProps))(UserFriendsList);
