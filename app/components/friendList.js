import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Loading } from '@components/common';
import CheckIcon from '@icons/icon_check_white.png';

const styles = StyleSheet.create({
  shareCategoryTitle: {
    fontSize: 16,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  borderedRow: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
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

const FriendList = ({ title, loading, friends, total, setOption, selected }) => {
  if (loading) return (<Loading />);

  if (total < 1) return null;

  const hasOption = key => selected.indexOf(key) > -1;

  const renderPic = (photo) => {
    let profileImage = null;

    if (photo) {
      profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return profileImage;
  };

  return (
    <View>
      <Text style={styles.shareCategoryTitle}>{title}</Text>
      {
        friends.map(friend => (
          <View key={friend.id} style={styles.borderedRow}>
            <TouchableWithoutFeedback
              onPress={() => setOption('friends', friend.id)}
            >
              <View style={styles.shareItem}>
                {renderPic(friend.photo)}
                <Text>{friend.firstName || friend.email}</Text>
                <View
                  style={[styles.shareToggle, hasOption(friend.id)
                    ?
                    styles.shareToggleActive
                    :
                    {}]}
                >
                  {
                    hasOption(friend.id) &&
                    <Image source={CheckIcon} style={styles.checkIcon} />
                  }
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
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
    photo: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
  total: PropTypes.number.isRequired,
  setOption: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default FriendList;
