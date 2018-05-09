import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Date from '@components/date';
import RelationBubbleList from '@components/relationBubbleList';
import { connect } from 'react-redux';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

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
  commentRelation: {
    marginTop: 16,
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
            <AppText color={Colors.text.blue} fontVariation="bold" style={{ paddingRight: 4 }}>
              {comment.User.firstName}
              <AppText size={12} color={Colors.text.gray} style={{ marginTop: 2 }}>
                <Date>{comment.date}</Date>
              </AppText>
            </AppText>
          </View>
          <View>
            <AppText style={{ marginTop: 4 }}>{comment.text}</AppText>
          </View>
          {comment.showRelation &&
            <View style={styles.commentRelation}>
              {comment.User.relation.relation.length > 2
                ? (<AppText size={12}>{trans('detail.you_are_friends_of_friends')}</AppText>)
                : (comment.User.relation.relation.length >= 1)
              && (<AppText size={12}>{trans('detail.you_are_friends')}</AppText>)
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

