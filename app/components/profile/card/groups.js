import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
  feed: {
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginVertical: 8,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',

  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedImg: {
    width: '100%',
    height: 160,
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  newGroupInfoWrapper: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000011',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGroupNameWrapper: {
    borderColor: '#ffffff',
    borderBottomWidth: 2,
    marginBottom: 12,
    paddingBottom: 8,
  },
  newGroupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newGroupPlace: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 6,
  },
  newGroupInfo: {
    color: '#ffffff',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 27,
    marginRight: 12,
  },
});

const Groups = ({ group, onPress, wrapperStyle }) => {
  let image = null;

  if (group.photo) {
    image = (<Image source={{ uri: group.photo }} style={styles.feedImg} />);
  } else {
    image = (<Image source={require('@assets/feed-img.jpg')} style={styles.feedImg} />);
  }

  let profileImage = null;

  if (group.User.avatar) {
    profileImage = (<Image source={{ uri: group.User.avatar }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={[styles.feed, wrapperStyle]}>
      <View style={styles.feedContent}>
        <View style={styles.feedTitle}>
          <TouchableOpacity onPress={() => onPress('profile', group.User.id)}>{profileImage}</TouchableOpacity>
          <Text style={styles.lightText}>
            <Text style={styles.name}>
              {group.User.firstName || group.User.email}
            </Text>
            <Text> {trans('feed.created_a_group')}</Text>
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={() => onPress('group', group)}>
          <View>
            {image}
            <View style={styles.newGroupInfoWrapper}>
              <View style={styles.newGroupNameWrapper}>
                <Text style={styles.newGroupName}>{group.name}</Text>
              </View>
              {
                group.outreach === STRETCH_TYPE_AREA &&
                <Text style={styles.newGroupPlace}>
                  {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                </Text>
              }

              {
                group.outreach === STRETCH_TYPE_ROUTE &&
                <Text style={styles.newGroupPlace}>
                  {group.TripStart.name} - {group.TripEnd.name}
                </Text>
              }
              <Text style={styles.newGroupInfo}>
                {group.type} {trans('feed.group')}, {group.GroupMembers.length} {group.GroupMembers.length > 1 ? 'participants' : 'participant'}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

Groups.propTypes = {
  group: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  wrapperStyle: View.propTypes.style,
};

Groups.defaultProps = {
  wrapperStyle: {},
};

export default Groups;
