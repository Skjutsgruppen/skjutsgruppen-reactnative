import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';
import { Avatar } from '@components/common';
import { Colors } from '@theme';

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

class ParticipantItem extends Component {
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
    const {
      participant: { User, admin },
      onPress,
      handleRemovePress,
      canDelete,
      userId,
    } = this.props;

    let profileImage = null;

    if (User.avatar) {
      profileImage = (
        <Avatar imageURI={User.avatar} size={46} onPress={() => onPress(User.id)} />
      );
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <TouchableHighlight
        onPress={() => { }}
        style={styles.wrapper}
        underlayColor={Colors.background.mutedPink}
      >
        <View style={styles.flexRow}>
          <View style={[styles.friend, styles.flexRow]}>
            {profileImage}
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>
                {User.firstName} {User.lastName}
              </Text>
            </View>
          </View>
          {
            !admin && canDelete && User.id !== userId &&
            <TouchableHighlight
              style={styles.action}
              onPress={() => handleRemovePress(User)}
              underlayColor={Colors.background.mutedPink}
            >
              <Image source={RemoveIcon} />
            </TouchableHighlight>
          }
        </View>
      </TouchableHighlight >
    );
  }
}

ParticipantItem.propTypes = {
  participant: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }),
    admin: PropTypes.bool.isRequired,
    enabler: PropTypes.bool.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  handleRemovePress: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
  userId: PropTypes.number.isRequired,
};

ParticipantItem.defaultProps = {
  canDelete: false,
};

export default ParticipantItem;
