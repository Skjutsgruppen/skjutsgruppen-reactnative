import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableHighlight } from 'react-native';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';
import { withUnfriend } from '@services/apollo/friend';
import { Loading } from '@components/common';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 28,
    color: Colors.text.black,
  },
  modalActionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 12,
  },
  modalAction: {
    width: '40%',
    padding: 12,
    borderRadius: 4,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pinkText: {
    color: Colors.text.pink,
  },
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

  renderModalContent = () => {
    const { friend, loading, error } = this.state;

    if (loading) {
      return (
        <View style={styles.modalContent}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={styles.modalContent}>
        {error !== null && <Text style={styles.errorText}>Error removing friend!</Text>}
        <Text style={styles.modalTitle}>
          Are you sure you want to remove
          <Text style={styles.boldText}> {friend.firstName} {friend.lastName} </Text>
          from your friends list?
        </Text>
        <View style={styles.modalActionWrapper}>
          <TouchableHighlight
            style={styles.modalAction}
            underlayColor="#f0f0f0"
            onPress={this.removeFriend}
          >
            <Text style={[styles.actionLabel, styles.pinkText]}>
              {error !== null ? 'Retry' : 'Remove'}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.modalAction}
            underlayColor="#f0f0f0"
            onPress={() => this.setConfirmModalVisibility(false)}
          >
            <Text style={styles.actionLabel}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderModal() {
    const { confirmModalVisibility } = this.state;

    return (
      <Modal
        transparent
        visible={confirmModalVisibility}
        animationType={'fade'}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
      >
        <View style={styles.modalContainer}>
          {this.renderModalContent()}
        </View>
      </Modal>
    );
  }

  render() {
    const { onPress, friends, editable } = this.props;

    return (
      <View>
        <DataList
          data={friends}
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
