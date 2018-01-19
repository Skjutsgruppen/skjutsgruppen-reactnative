import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Date from '@components/date';
import CommentIcon from '@icons/ic_comment.png';
import { trans } from '@lang/i18n';
import { FEEDABLE_NEWS } from '@config/constant';

const cardHeight = 484;
const profilePicSize = 60;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  wrapper: {
    height: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 4,
  },
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.gray,
  },
  img: {
    width: '100%',
    height: cardHeight / 2,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newsAvatar: {
    height: profilePicSize,
    width: profilePicSize,
    position: 'absolute',
    top: (cardHeight / 2) - (profilePicSize / 2),
    right: 20,
    zIndex: 10,
    backgroundColor: Colors.background.blue,
    borderRadius: (profilePicSize / 2),
    borderWidth: 2,
    borderColor: Colors.border.white,
  },
  offerType: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  typeText: {
    color: Colors.text.white,
    fontSize: 10,
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  comment: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentGradientOverlay: {
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.85)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 24,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#888',
    marginRight: 10,
  },
  text: {
    lineHeight: 20,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

class News extends Component {
  renderLinks = () => {
    const { news } = this.props;

    if (!news.links) return null;
    let i = 0;
    return news.links.map((link) => {
      i += 1;
      return (<Text key={i}>{link}</Text>);
    });
  }

  render() {
    const { news, onPress, wrapperStyle } = this.props;
    let image = null;

    if (news.photo) {
      image = (<Image source={{ uri: news.photo }} style={styles.img} />);
    }

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <TouchableWithoutFeedback
          onPress={() => onPress(FEEDABLE_NEWS, news)}
          style={styles.flex1}
        >
          <View style={styles.flex1}>
            <View style={styles.imgWrapper}>
              {image}
            </View>
            <View style={[styles.offerType, styles.blueBg]}>
              <Text style={styles.typeText}>{trans('feed.your_movement').toUpperCase()}</Text>
            </View>
            <View style={styles.detail}>
              <View>
                <Text style={[styles.text, styles.lightText]}>
                  <Text style={styles.username}>
                    {trans('feed.your_movement')}
                  </Text>
                </Text>
                <Text style={[styles.text, styles.lightText]}><Date format="MMM DD HH:mm">{news.updatedAt}</Date></Text>
              </View>
            </View>
            <View style={styles.comment}>
              <Text style={styles.text}>{news.body}</Text>
              {this.renderLinks()}
              <View style={styles.commentGradientOverlay} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.newsAvatar} />
        <View style={styles.footer}>
          <View style={styles.commentIcon}>
            <Text style={styles.commentCount}>{news.totalComments}</Text>
            <TouchableOpacity onPress={() => onPress(FEEDABLE_NEWS, news)}>
              <Image source={CommentIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

News.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number,
    body: PropTypes.string,
  }).isRequired,
  wrapperStyle: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
};

News.defaultProps = {
  wrapperStyle: {},
};

export default News;
