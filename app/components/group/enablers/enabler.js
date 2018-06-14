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
  action: {
    height: 48,
    width: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Enabler extends Component {
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
    const { enabler: { User, admin }, onPress, handleRemovePress, canDelete, userId } = this.props;
    let profileImage = null;

    if (User.avatar) {
      profileImage = (
        <Avatar imageURI={User.avatar} size={48} onPress={() => onPress(User.id)} />
      );
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <TouchableHighlight
        onPress={() => onPress(User.id)}
        style={styles.wrapper}
        underlayColor={Colors.background.mutedPink}
      >
        <View style={styles.flexRow}>
          <View style={[styles.friend, styles.flexRow]}>
            {profileImage}
            <View style={styles.nameWrapper}>
              <AppText color={Colors.text.blue} fontVariation="semibold">{User.firstName} {User.lastName}</AppText>
            </View>
          </View>
          {
            ((userId === User.id && admin) || !admin) && canDelete &&
            <TouchableHighlight
              style={styles.action}
              onPress={() => handleRemovePress(User, userId === User.id)}
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

Enabler.propTypes = {
  enabler: PropTypes.shape({
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

Enabler.defaultProps = {
  canDelete: false,
};

export default Enabler;
