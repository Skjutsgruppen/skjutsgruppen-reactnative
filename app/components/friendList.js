import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import ShareItem from '@components/common/shareItem';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  shareCategoryTitle: {
    fontSize: 12,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 24,
    marginTop: 16,
  },
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  shareToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 'auto',
  },
  shareToggleGray: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border.gray,
    backgroundColor: Colors.border.gray,
    marginLeft: 'auto',
  },
  shareToggleActive: {
    backgroundColor: '#a27ba8',
    borderColor: '#a27ba8',
  },
  checkIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
});

const FriendList = ({ title, loading, friends, setOption, selected, disabled }) => {
  const filteredFriends = friends.filter(row => row);

  if (loading && filteredFriends.length < 1) return (<Loading />);

  if (filteredFriends.length < 1) return null;

  const hasOption = key => selected.indexOf(key) > -1;
  const hasDisabled = key => disabled.indexOf(key) > -1;

  return (
    <View style={styles.list}>
      <Text style={styles.shareCategoryTitle}>{title.toUpperCase()}</Text>
      {
        filteredFriends.map(friend => (
          <ShareItem
            key={friend.id}
            imageSource={{ uri: friend.avatar }}
            hasPhoto
            selected={hasOption(friend.id)}
            label={friend.firstName || friend.email}
            onPress={() => !hasDisabled(friend.id) && setOption('friends', friend.id)}
          />
        ))
      }
    </View>
  );
};

FriendList.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  friends: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
  setOption: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  disabled: PropTypes.arrayOf(PropTypes.number),
};

FriendList.defaultProps = {
  disabled: [],
};

export default FriendList;
