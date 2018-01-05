import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import Relation from '@components/relation';

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
    color: '#000',
  },
  commentRelation: {
    marginTop: 16,
  },
  filler: {
    padding: 12,
    color: '#999',
  },
  smallText: {
    fontSize: 12,
  },
});

const Item = ({ comment, onPress, navigation }) => {
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
            <Text style={[styles.time, styles.smallText]}> <Date>{comment.date}</Date></Text>
          </Text>
        </View>
        <View>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
        <View style={styles.commentRelation}>
          {comment.User.relation.length > 2
            ? (<Text style={styles.smallText}>You are friends of friends!</Text>)
            : (comment.User.relation.length >= 1)
            && (<Text style={styles.smallText}>You are friends!</Text>)
          }
          <Relation
            navigation={navigation}
            users={comment.User.relation}
            avatarSize={24}
            style={{ marginHorizontal: 0 }}
          />
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Item;
