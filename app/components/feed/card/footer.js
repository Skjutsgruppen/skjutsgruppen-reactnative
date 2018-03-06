import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import ShareIcon from '@assets/icons/ic_share.png';
import CommentIcon from '@assets/icons/ic_comment.png';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCout: {
    color: Colors.text.gray,
    marginRight: 10,
  },
  readMore: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

const Footer = ({ onSharePress, onCommentPress, totalFeeds, hasReadMore }) => (
  <View style={styles.wrapper}>
    <TouchableOpacity onPress={onSharePress}>
      <Image source={ShareIcon} style={styles.shareIcon} />
    </TouchableOpacity>
    {
      hasReadMore && (
        <TouchableOpacity
          onPress={onCommentPress}
        >
          <Text style={styles.readMore}>{trans('feed.read_more')}</Text>
        </TouchableOpacity>
      )
    }
    {
      !hasReadMore && (
        <View style={styles.commentIcon}>
          <Text style={styles.commentCout}>{totalFeeds}</Text>
          <TouchableOpacity onPress={onCommentPress}>
            <Image source={CommentIcon} style={styles.commentIcon} />
          </TouchableOpacity>
        </View>
      )
    }
  </View>
);

Footer.propTypes = {
  onSharePress: PropTypes.func,
  onCommentPress: PropTypes.func,
  totalFeeds: PropTypes.number,
  hasReadMore: PropTypes.bool,
};

Footer.defaultProps = {
  onSharePress: () => {},
  onCommentPress: () => {},
  totalFeeds: 0,
  hasReadMore: false,
};

export default Footer;
