import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import { FEEDABLE_TRIP, FEEDABLE_GROUP, FEEDABLE_NEWS, FEEDABLE_EXPERIENCE } from '@config/constant';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueText: {
    color: Colors.text.blue,
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    left: 'auto',
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 4,
  },
});

const Conversation = ({ conversation, onPress }) => {
  let typeName = null;
  let image = null;

  if (!conversation || !conversation.Commentable) return null;

  const { __typename } = conversation.Commentable;

  if (conversation.Commentable.photo) {
    image = conversation.Commentable.photo;
  } else {
    image = conversation.Commentable.mapPhoto;
  }

  if (__typename === FEEDABLE_GROUP) {
    typeName = conversation.Commentable.name;
  } else if (__typename === FEEDABLE_TRIP) {
    typeName = `${conversation.Commentable.TripStart.name} - ${conversation.Commentable.TripEnd.name}`;
  } else if (__typename === FEEDABLE_NEWS) {
    typeName = `${conversation.Commentable.title}`;
  } else if (__typename === FEEDABLE_EXPERIENCE) {
    typeName = `${conversation.Commentable.Trip.TripStart.name} - ${conversation.Commentable.Trip.TripEnd.name}`;
  }

  return (
    <TouchableOpacity onPress={() => onPress(__typename, conversation.Commentable)}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            <Image source={{ uri: image }} style={styles.profilePic} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bold}>{typeName}</Text>
            <Text style={styles.blueText}>
              {conversation.text}
            </Text>
          </View>
        </View>
        <View>
          <Text style={[styles.time, styles.bold]}>
            <Date format="MMM DD">{conversation.date}</Date>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

Conversation.propTypes = {
  onPress: PropTypes.func.isRequired,
  conversation: PropTypes.shape({
    date: PropTypes.string,
    text: PropTypes.string,
    Commentable: PropTypes.shape(),
  }).isRequired,
};

export default Conversation;
