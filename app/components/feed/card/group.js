import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE, FEEDABLE_GROUP } from '@config/constant';
import { Footer } from '@components/feed/card';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@theme';
import GroupImage from '@components/group/groupImage';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';

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
    flexBasis: 56,
    minHeight: 56,
    paddingHorizontal: 18,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentGradientOverlay: {
    height: 24,
    position: 'absolute',
    bottom: -3,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

const Group = ({ group, onPress, min, onSharePress, wrapperStyle }) => {
  let profileImage = null;

  if (group.isDeleted) {
    return null;
  }

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
                <AppText>
                  <AppText fontVariation="semibold" color={group.User.deleted ? Colors.text.black : Colors.text.blue}>
                    {group.User.firstName || group.User.email}
                  </AppText>
                  <AppText color={Colors.text.darkGray}> {trans('feed.created_a_group')}</AppText>
                </AppText>
                {
                  group.outreach === STRETCH_TYPE_AREA &&
                  <AppText color={Colors.text.darkGray}>
                    {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                  </AppText>
                }
                {
                  group.outreach === STRETCH_TYPE_ROUTE &&
                  <AppText color={Colors.text.darkGray}>
                    {
                      group.TripStart.name ?
                        group.TripStart.name :
                        group.direction
                    } - {
                      group.TripEnd.name ?
                        group.TripEnd.name :
                        group.direction
                    }
                  </AppText>
                }
              </View>
            </View>
            <View style={styles.comment}>
              <AppText>{group.description}</AppText>
              <LinearGradient
                locations={[0, 0.3, 0.7, 0.8]}
                colors={[
                  'rgba(255, 255, 255, 0)',
                  'rgba(255, 255, 255, 0.5)',
                  'rgba(255, 255, 255, 0.85)',
                  'rgba(255, 255, 255, 1)',
                ]}
                style={styles.commentGradientOverlay}
              />
            </View>
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
    photo: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    User: PropTypes.object,
    outreach: PropTypes.string,
    country: PropTypes.string,
    county: PropTypes.string,
    municipality: PropTypes.string,
    locality: PropTypes.string,
    TripStart: PropTypes.object,
    TripEnd: PropTypes.object,
    description: PropTypes.string,
    direction: PropTypes.string,
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
