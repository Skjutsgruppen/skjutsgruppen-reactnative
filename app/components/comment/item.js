import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import RelationBubbleList from '@components/relationBubbleList';
import { connect } from 'react-redux';

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
  smallText: {
    fontSize: 12,
  },
});

const Item = ({ user, comment, onPress, onCommentLongPress }) => {
  let image = null;

  if (comment.User.avatar) {
    image = (<Image source={{ uri: comment.User.avatar }} style={styles.profilePic} />);
  } else {
    image = (<View style={styles.imgIcon} />);
  }

  const avatarSize = 24;

  return (
    <TouchableWithoutFeedback
      onLongPress={() => onCommentLongPress(user.id === comment.User.id, comment.id)}
    >
      <View style={styles.commentWrapper}>
        <TouchableOpacity onPress={() => onPress(comment.User.id)}>{image}</TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={styles.name}>
              {comment.User.firstName}
              <Text style={[styles.time, styles.smallText]}> <Date>{comment.date}</Date></Text>
            </Text>
          </View>
          <View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
          {comment.showRelation &&
            <View style={styles.commentRelation}>
              {comment.User.relation.relation.length > 2
                ? (<Text style={styles.smallText}>You are friends of friends!</Text>)
                : (comment.User.relation.relation.length >= 1)
                && (<Text style={styles.smallText}>You are friends!</Text>)
              }
              <RelationBubbleList
                users={comment.User.relation}
                avatarSize={avatarSize}
                style={{ marginHorizontal: 0 }}
                setModalVisibility={() => onPress(comment.User.id)}
              />
            </View>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

Item.propTypes = {
  comment: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string,
      date: PropTypes.string,
    }),
    date: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onCommentLongPress: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Item);

