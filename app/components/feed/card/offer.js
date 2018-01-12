import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import ShareIcon from '@icons/ic_share.png';
import CommentIcon from '@icons/ic_comment.png';
import Date from '@components/date';
import { trans } from '@lang/i18n';

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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  groupName: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
  },
  profilePicWrapper: {
    height: profilePicSize,
    width: profilePicSize,
    position: 'absolute',
    top: (cardHeight / 2) - (profilePicSize / 2),
    right: 20,
    zIndex: 10,
  },
  profilePic: {
    height: profilePicSize,
    width: profilePicSize,
    resizeMode: 'cover',
    borderRadius: 30,
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
  pinkBg: {
    backgroundColor: Colors.background.pink,
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
  commentCout: {
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
  shareIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

const Offer = ({ offer, onPress, onSharePress, wrapperStyle }) => {
  let image = null;
  if (offer.mapPhoto) {
    image = (<Image source={{ uri: offer.mapPhoto }} style={styles.img} />);
  }

  if (offer.photo) {
    image = (<Image source={{ uri: offer.photo }} style={styles.img} />);
  }

  let profileImage = null;
  if (offer.User.avatar) {
    profileImage = (<Image source={{ uri: offer.User.avatar }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableWithoutFeedback
        onPress={() => onPress('offer', offer)}
        style={styles.flex1}
      >
        <View style={styles.flex1}>
          <View style={styles.imgWrapper}>
            {image}
          </View>
          <View style={[styles.offerType, styles.pinkBg]}>
            <Text style={styles.typeText}>{trans('feed.offering_a_ride')}</Text>
          </View>
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username}>{offer.User.firstName || offer.User.email} </Text>
                <Text> {trans('feed.offers')} {offer.seats} {offer.seats > 1 ? trans('feed.seats') : trans('feed.seat')} </Text>
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                {offer.TripStart.name} - {offer.TripEnd.name}
              </Text>
              <Text style={[styles.text, styles.lightText]}><Date format="MMM DD HH:mm">{offer.date}</Date></Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>{offer.description}</Text>
            <View style={styles.commentGradientOverlay} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={() => onPress('profile', offer.User.id)}
        style={styles.profilePicWrapper}
      >
        {profileImage}
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => onSharePress('offer', offer)}>
          <Image source={ShareIcon} style={styles.shareIcon} />
        </TouchableOpacity>
        <View style={styles.commentIcon}>
          <Text style={styles.commentCout}>{offer.totalComments}</Text>
          <TouchableOpacity onPress={() => onPress('offer', offer)}>
            <Image source={CommentIcon} style={styles.commentIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>);
};

Offer.propTypes = {
  offer: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  wrapperStyle: View.propTypes.style,
};

Offer.defaultProps = {
  wrapperStyle: {},
};

export default Offer;
