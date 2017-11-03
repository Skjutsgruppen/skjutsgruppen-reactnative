import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Relation from '@components/relation';

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
  tab: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
  feedAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 2,
    borderColor: '#dddee3',
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
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

const Group = ({ group, onPress, min, onSharePress }) => {
  console.log(group);

  let image = null;
  if (group.photo) {
    image = (<Image source={{ uri: group.photo }} style={styles.feedImg} />);
  } else {
    image = (<Image source={require('@assets/feed-img.jpg')} style={styles.feedImg} />);
  }

  let profileImage = null;

  if (!min) {
    if (group.User.photo) {
      profileImage = (<Image source={{ uri: group.User.photo }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }
  }

  return (
    <View style={styles.feed}>
      <View style={styles.feedContent}>
        {!min &&
          <View style={styles.feedTitle}>
            {profileImage}
            <Text style={styles.lightText}>
              <Text style={styles.name}>
                {group.User.firstName || group.User.email}
              </Text>
              <Text> created a group</Text>
            </Text>
          </View>
        }
        <TouchableWithoutFeedback onPress={() => onPress('group', group)}>
          <View>
            {image}
            <View style={styles.newGroupInfoWrapper}>
              <View style={styles.newGroupNameWrapper}>
                <Text style={styles.newGroupName}>{group.name}</Text>
              </View>
              {
                group.outreach === 'area' &&
                <Text style={styles.newGroupPlace}>
                  {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                </Text>
              }

              {
                group.outreach === 'route' &&
                <Text style={styles.newGroupPlace}>
                  {group.TripStart.name} - {group.TripEnd.name}
                </Text>
              }
              <Text style={styles.newGroupInfo}>
                {group.type} group, {group.GroupMembers.length} {group.GroupMembers.length > 1 ? 'participants' : 'participant'}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {!min &&
        <View style={styles.feedAction}>
          <Relation users={group.User.relation} />
          <View style={styles.verticalDevider} />
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => onSharePress('group', group)}>
              <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.tabLabel}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.verticalDevider} />
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => onPress('group', group)}>
              <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.tabLabel}>Comment</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      }
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
};

Group.defaultProps = {
  onSharePress: () => { },
  min: false,
};

export default Group;
