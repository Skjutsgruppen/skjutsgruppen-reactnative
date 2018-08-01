import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';
import { Avatar } from '@components/common';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

import RemoveIcon from '@assets/icons/ic_cross.png';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  friend: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 10,
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
    color: Colors.text.blue,
    fontWeight: '500',
  },
  action: {
    height: 48,
    width: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
    const { friend, onPress, handleRemovePress, removeFriendOption } = this.props;
    let profileImage = null;

    if (friend.avatar) {
      profileImage = (
        <Avatar imageURI={friend.avatar} size={46} onPress={() => onPress(friend.id)} />
      );
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <TouchableHighlight
        onPress={() => onPress(friend.id)}
        style={styles.wrapper}
        underlayColor={Colors.background.mutedPink}
      >
        <View style={styles.flexRow}>
          <View style={[styles.friend, styles.flexRow]}>
            {profileImage}
            <View style={styles.nameWrapper}>
              <AppText color={Colors.text.blue} fontVariation="semibold">{friend.firstName} {friend.lastName}</AppText>
            </View>
          </View>
          {
            removeFriendOption &&
            <TouchableHighlight
              style={styles.action}
              onPress={() => handleRemovePress(friend)}
              underlayColor={Colors.background.mutedPink}
            >
              <Image source={RemoveIcon} />
            </TouchableHighlight>
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
  removeFriendOption: PropTypes.bool,
};

Friends.defaultProps = {
  removeFriendOption: false,
};

export default Friends;
