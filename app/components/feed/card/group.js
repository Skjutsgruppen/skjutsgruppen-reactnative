import React from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE, FEEDABLE_GROUP } from '@config/constant';
import { Footer } from '@components/feed/card';
import Colors from '@theme/colors';
import GroupImage from '@components/group/groupImage';
import { trans } from '@lang/i18n';

const cardHeight = 484;
const profilePicSize = 60;

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: cardHeight,
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
    paddingHorizontal: 18,
    paddingTop: 20,
    marginBottom: 20,
  },
  comment: {
    flex: 1,
    flexBasis: 50,
    minHeight: 50,
    paddingHorizontal: 18,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
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
});

const Group = ({ group, onPress, min, onSharePress, wrapperStyle }) => {
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
        onPress={() => onPress(FEEDABLE_GROUP, group)}
      >
        <View>
          <View style={styles.flex1}>
            <GroupImage
              group={group}
              roundedCorner
            />
            <View style={styles.detail}>
              <View>
                <Text style={[styles.text, styles.lightText]}>
                  <Text style={styles.username}>
                    {group.User.firstName || group.User.email}
                  </Text>
                  <Text> {trans('feed.created_a_group')}</Text>
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
              <Text style={[styles.text, styles.commentText]}>{group.description}</Text>
              <View style={styles.commentGradientOverlay} />
            </View>
          </View>
          <View style={styles.profilePicWrapper}>
            {profileImage}
          </View>
          <View style={styles.profilePicWrapper}>
            {profileImage}
          </View>
        </View>
      </TouchableWithoutFeedback>
      {
        typeof onSharePress === 'function' &&
        <Footer
          onSharePress={() => onSharePress(FEEDABLE_GROUP, group)}
          onCommentPress={() => onPress(FEEDABLE_GROUP, group)}
          hasReadMore
        />
      }
    </View>
  );
};

Group.propTypes = {
  group: PropTypes.shape({
    photo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    User: PropTypes.object.isRequired,
    outreach: PropTypes.string.isRequired,
    country: PropTypes.string,
    county: PropTypes.string,
    municipality: PropTypes.string,
    locality: PropTypes.string,
    TripStart: PropTypes.object.isRequired,
    TripEnd: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func,
  min: PropTypes.bool,
  wrapperStyle: ViewPropTypes.style,
};

Group.defaultProps = {
  onSharePress: null,
  min: false,
  wrapperStyle: {},
};

export default Group;
