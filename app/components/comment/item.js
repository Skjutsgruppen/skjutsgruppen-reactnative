import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';

const styles = StyleSheet.create({
  commentWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
    paddingRight: 4,
  },
  time: {
    color: '#777777',
    fontWeight: 'normal',
    marginTop: 2,
  },
  commentText: {
    marginTop: 4,
  },
  filler: {
    padding: 12,
    color: '#999',
  },
});

const Item = ({ comment, onPress }) => {
  let image = null;
  if (comment.User.avatar) {
    image = (<Image source={{ uri: comment.User.avatar }} style={styles.profilePic} />);
  } else {
    image = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={styles.commentWrapper}>
      <TouchableOpacity onPress={() => onPress(comment.User.id)}>{image}</TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={styles.name}>
            {comment.User.firstName || comment.User.email}
            <Text style={styles.time}> <Date>{comment.date}</Date></Text>
          </Text>
        </View>
        <View>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      </View>
    </View>
  );
};

Item.propTypes = {
  comment: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
      date: PropTypes.string,
    }),
    date: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Item;
