import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableHighlight } from 'react-native';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';

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
});

class UserFriendsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmModalVisibility: false,
      friend: {},
    };
  }

  setConfirmModalVisibility = (visibility) => {
    this.setState({ confirmModalVisibility: visibility });
  }

  handleRemovePress = (friend) => {
    this.setConfirmModalVisibility(true);
    this.setState({ friend });
  }

  render() {
    const { onPress, friends, editable } = this.props;
    const { friend } = this.state;

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
        <Modal
          transparent
          visible={this.state.confirmModalVisibility}
          animationType={'slide'}
          onRequestClose={() => this.setConfirmModalVisibility(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Are you sure you want to remove {friend.firstName} {friend.lastName}
                from your friends list?
              </Text>
              <View style={styles.modalActionWrapper}>
                <TouchableHighlight
                  style={styles.modalAction}
                  underlayColor="#f0f0f0"
                  onPress={() => this.setConfirmModalVisibility(false)}
                >
                  <Text style={[styles.actionLabel, styles.pinkText]}>Confirm</Text>
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
          </View>
        </Modal>
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
  editable: PropTypes.bool,
};

UserFriendsList.defaultProps = {
  editable: false,
};

export default UserFriendsList;
