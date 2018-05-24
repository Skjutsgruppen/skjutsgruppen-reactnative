import React, { Component } from 'react';
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
const imageHeight = 230;
const profilePicSize = 64;

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 19,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePicWrapper: {
    height: profilePicSize,
    width: profilePicSize,
    position: 'absolute',
    top: imageHeight - (profilePicSize / 2),
    right: 20,
    zIndex: 10,
  },
  profilePic: {
    height: profilePicSize,
    width: profilePicSize,
    resizeMode: 'cover',
    borderRadius: (profilePicSize / 2),
    borderWidth: 2,
    borderColor: Colors.border.white,
  },
  detail: {
    paddingHorizontal: 18,
    paddingTop: 20,
    marginBottom: 20,
  },
  comment: {
    minHeight: 48,
    maxHeight: 50,
    paddingTop: 2,
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

class Group extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showOverlay: false,
    };
  }

  onLayout = (e) => {
    const height = e.nativeEvent.layout.height;
    const showOverlay = height > 48;

    this.setState({
      showOverlay,
    });
  }

  render() {
    const { group, onPress, min, onSharePress, wrapperStyle } = this.props;

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
                  <AppText style={{ lineHeight: 24 }}>
                    <AppText fontVariation="semibold" color={group.User.deleted ? Colors.text.black : Colors.text.blue}>
                      {group.User.firstName || group.User.email}
                    </AppText>
                    <AppText color={Colors.text.darkGray}> {trans('feed.created_a_group')}</AppText>
                  </AppText>
                  <AppText color={Colors.text.darkGray} style={{ marginBottom: 6 }}>{`"${group.name}"`}</AppText>
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
              <View
                style={[
                  styles.comment,
                  this.state.showOverlay ? { minHeight: 48 } : { minHeight: 24 },
                  typeof onSharePress === 'function' ? {} : { marginBottom: 20 },
                ]}
                onLayout={this.onLayout}
              >
                <AppText style={{ lineHeight: 24 }}>{group.description}</AppText>
                {
                  this.state.showOverlay && <LinearGradient
                    locations={[0, 0.3, 0.7, 0.8]}
                    colors={[
                      'rgba(255, 255, 255, 0)',
                      'rgba(255, 255, 255, 0.5)',
                      'rgba(255, 255, 255, 0.85)',
                      'rgba(255, 255, 255, 1)',
                    ]}
                    style={styles.commentGradientOverlay}
                  />
                }

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
  }
}

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
