import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { Avatar } from '@components/common';
import { Colors } from '@theme';
import Radio from '@components/add/radio';

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

class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmModalVisibility: false,
    };
  }

  onParticipantSelected = () => {
    const { member: { User }, onSelect } = this.props;
    onSelect(User);
  }

  setConfirmModalVisibility = (visibility) => {
    this.setState({ confirmModalVisibility: visibility });
  }

  render() {
    const { member: { User }, onPress, active } = this.props;
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
          <Radio onPress={this.onParticipantSelected} active={active} />
        </View>
      </TouchableHighlight >
    );
  }
}

Item.propTypes = {
  member: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }),
    admin: PropTypes.bool.isRequired,
    enabler: PropTypes.bool.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

Item.defaultProps = {
  canDelete: false,
  isAdmin: false,
};

export default Item;
