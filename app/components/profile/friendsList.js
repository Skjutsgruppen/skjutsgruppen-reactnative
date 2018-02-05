import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';
import { withUnfriend } from '@services/apollo/friend';
import { SearchBar, ConfirmModal } from '@components/common';

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    color: Colors.text.red,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

class UserFriendsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmModalVisibility: false,
      friend: {},
      loading: false,
      refetch: null,
      error: null,
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
        .then(() => this.setState({ loading: false }))
        .then(() => this.setConfirmModalVisibility(false))
        .then(refetch)
        .catch(error => this.setState({ loading: false, error }));
    });
  }

  renderModal() {
    const { confirmModalVisibility, friend, loading, error } = this.state;
    const message = (
      <Text>
        Are you sure you want to remove
        <Text style={styles.boldText}> {friend.firstName} {friend.lastName} </Text>
        from your friends list?
      </Text>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={error !== null ? 'Retry' : 'Yes'}
        denyLabel="No"
        onConfirm={this.removeFriend}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  render() {
    const { onPress, friends, editable } = this.props;

    return (
      <View>
        <DataList
          data={friends}
          header={() => <SearchBar placeholder="Search" style={{ marginTop: 48, marginBottom: 30 }} />}
          renderItem={({ item }) => (
            <Friends
              key={item.id}
              friend={item}
              editable={editable}
              onPress={onPress}
              handleRemovePress={(user) => { this.handleRemovePress(user); }}
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
      </View>
    );
  }
}

UserFriendsList.propTypes = {
  friends: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  unfriend: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  subscribeToNewFriend: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

UserFriendsList.defaultProps = {
  editable: false,
};

export default withUnfriend(UserFriendsList);
