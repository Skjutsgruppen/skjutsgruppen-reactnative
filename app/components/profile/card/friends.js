import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 27,
    marginRight: 12,
  },
});

const Friends = ({ friend, onPress }) => {
  let profileImage = null;

  if (friend.photo) {
    profileImage = (
      <TouchableOpacity onPress={() => onPress(friend.id)}>
        <Image source={{ uri: friend.photo }} style={styles.profilePic} />
      </TouchableOpacity>
    );
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={styles.feed}>
      <View style={styles.feedContent}>
        <View style={styles.feedTitle}>
          <TouchableOpacity>{profileImage}</TouchableOpacity>
          <Text style={styles.lightText}>
            <Text style={styles.name}>
              {friend.firstName || friend.email} {friend.lastName}
            </Text>
          </Text>
        </View>
      </View>
    </View>);
};

Friends.propTypes = {
  friend: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Friends;
