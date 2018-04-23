import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

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
  profilePic: {
    height: 36,
    width: 36,
    borderRadius: 27,
    marginRight: 12,
  },
});

const MemberItem = ({ user: { User }, onPress }) => {
  let profileImage = null;

  if (User.avatar) {
    profileImage = (
      <Image source={{ uri: User.avatar }} style={styles.profilePic} />
    );
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <TouchableOpacity onPress={() => onPress(User.id)} style={styles.wrapper}>
      {profileImage}
      <View style={styles.nameWrapper}>
        <AppText fontVariation="bold" color={Colors.text.blue}>{User.firstName}</AppText>
      </View>
    </TouchableOpacity>
  );
};

MemberItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  user: PropTypes.shape({
    User: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default MemberItem;

