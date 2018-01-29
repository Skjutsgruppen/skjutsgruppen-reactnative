import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Avatar } from '@components/common';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
  },
  friend: {
    flex: 1,
    padding: 12,
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actionLabel: {
    color: Colors.text.blue,
    fontSize: 16,
    fontWeight: '500',
  },
  errorLabel: {
    color: Colors.text.red,
    fontSize: 16,
    fontWeight: '500',
  },
});

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmModalVisibility: false,
    };
  }

  setConfirmModalVisibility = (visibility) => {
    this.setState({ confirmModalVisibility: visibility });
  }

  render() {
    const { friend, onPress, handleRemovePress, editable } = this.props;
    let profileImage = null;

    if (friend.avatar) {
      profileImage = (
        <Avatar imageURI={friend.avatar} size={55} onPress={() => onPress(friend.id)} />
      );
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <TouchableHighlight
        onPress={() => onPress(friend.id)}
        style={styles.wrapper}
        underlayColor="#f0f0f0"
      >
        <View style={styles.flexRow}>
          <View style={[styles.friend, styles.flexRow]}>
            {profileImage}
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>
                {friend.firstName} {friend.lastName}
              </Text>
            </View>
          </View>
          {
            editable && !friend.inPhoneContact &&
            <TouchableOpacity style={styles.action} onPress={() => handleRemovePress(friend)}>
              <Text style={styles.actionLabel}>Remove</Text>
            </TouchableOpacity>
          }
        </View>
      </TouchableHighlight>
    );
  }
}

Friends.propTypes = {
  friend: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  handleRemovePress: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

Friends.defaultProps = {
  editable: false,
};

export default Friends;
