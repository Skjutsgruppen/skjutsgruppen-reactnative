import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import ShareIcon from '@icons/ic_share.png';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';

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
    marginVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1.0,
    shadowRadius: 2,
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
    marginHorizontal: 24,
    textAlign: 'center',
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
  text: {
    lineHeight: 20,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
    marginRight: 2,
  },
  readMore: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  shareIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

const Group = ({ group, onPress, min, onSharePress, wrapperStyle }) => {
  let image = null;
  if (group.photo) {
    image = (<Image source={{ uri: group.photo }} style={styles.img} />);
  } else if (group.mapPhoto) {
    image = (<Image source={{ uri: group.mapPhoto }} style={styles.img} />);
  } else {
    image = (<Image source={require('@assets/feed-img.jpg')} style={styles.img} />);
  }

  let profileImage = null;

  if (!min) {
    if (group.User.avatar) {
      profileImage = (<Image source={{ uri: group.User.avatar }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }
  }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableWithoutFeedback
        onPress={() => onPress('group', group)}
        style={styles.flex1}
      >
        <View style={styles.flex1}>
          <View style={styles.imgWrapper}>
            {image}
            <Text style={styles.groupName}>{group.name}</Text>
          </View>
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username}>
                  {group.User.firstName || group.User.email}
                </Text>
                <Text> created a group</Text>
              </Text>
              {
                group.outreach === STRETCH_TYPE_AREA &&
                <Text style={[styles.text, styles.lightText]}>
                  {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                </Text>
              }
              {
                group.outreach === STRETCH_TYPE_ROUTE &&
                <Text style={[styles.text, styles.lightText]}>
                  {group.TripStart.name} - {group.TripEnd.name}
                </Text>
              }
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>{group.description}</Text>
            <View style={styles.commentGradientOverlay} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={() => onPress('profile', group.User.id)}
        style={styles.profilePicWrapper}
      >
        {profileImage}
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => onSharePress('group', group)}>
          <Image source={ShareIcon} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.readMoreWrapper} onPress={() => onPress('group', group)}>
          <Text style={styles.readMore}>Read more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

Group.propTypes = {
  group: PropTypes.shape({
    photo: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func,
  min: PropTypes.bool,
  wrapperStyle: View.propTypes.style,
};

Group.defaultProps = {
  onSharePress: () => { },
  min: false,
  wrapperStyle: {},
};

export default Group;
