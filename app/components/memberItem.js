import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  nameWrapper: {
    flex: 1,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  profilePic: {
    height: 36,
    width: 36,
    borderRadius: 27,
    marginRight: 12,
  },
});

const MemberItem = ({ user, onPress }) => {
  let profileImage = null;

  if (user.avatar) {
    profileImage = (
      <Image source={{ uri: user.avatar }} style={styles.profilePic} />
    );
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <TouchableOpacity onPress={() => onPress(user.id)} style={styles.wrapper}>
      {profileImage}
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{user.firstName}</Text>
      </View>
    </TouchableOpacity>
  );
};

MemberItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default MemberItem;

