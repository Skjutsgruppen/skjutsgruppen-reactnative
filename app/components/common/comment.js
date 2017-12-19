import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import ProfilePicture from '@components/common/profilePicture';
import Username from '@components/common/username';
import ProfilePic from '@assets/profilePic.jpg';
import Relation from '@components/common/relation';

const users = [
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
];


const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  text: {
    lineHeight: 20,
  },
  lightText: {
    color: Colors.text.gray,
  },
  smallText: {
    fontSize: 12,
  },
  details: {
    flex: 1,
    paddingLeft: 16,
  },
  commentText: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 6,
  },
  relation: {
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 0,
  },
});

const Comment = () => (
  <TouchableWithoutFeedback onLongPress={() => Alert.alert('long pressed')}>
    <View style={styles.wrapper}>
      <ProfilePicture source={ProfilePic} size={40} />
      <View style={styles.details}>
        <Text>
          <Username name="Lovisa" />
          <Text style={[styles.smallText, styles.lightText]}>Sunday 19.45</Text>
        </Text>
        <Text style={[styles.text, styles.commentText]}>
          Some more words that a great  participant like Lesse would write if thiswas a real ride.
        </Text>
        <Text style={[styles.smallText, styles.lightText]}>Your are friends of friends!</Text>
        <Relation users={users} size={24} arrowSize={8} style={styles.relation} />
      </View>
    </View>
  </TouchableWithoutFeedback>
);

// Comment.propTypes = {
//   name: PropTypes.string.isRequired,
//   style: Text.propTypes.style,
// };

// Comment.defaultProps = {
//   style: {},
// };

export default Comment;
