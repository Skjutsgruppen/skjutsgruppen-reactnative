import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  commentWrapper: {
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 28,
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
    marginTop: 2,
  },
  filler: {
    padding: 12,
    color: '#999',
  },
});

const Item = ({ comment }) => {
  let image = null;
  if (comment.User.photo) {
    image = (<Image source={{ uri: comment.User.photo }} style={styles.profilePic} />);
  } else {
    image = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={styles.commentWrapper}>
      {image}
      <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Text style={styles.name}>{comment.User.firstName || comment.User.email}</Text>
          <Text style={styles.time}>{comment.date}</Text>
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
};

export default Item;
