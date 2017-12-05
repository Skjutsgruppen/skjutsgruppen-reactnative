import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import Relation from '@components/relation';
import PropTypes from 'prop-types';

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
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 27,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  fromTo: {
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  stopIcon: {
    width: 12,
    resizeMode: 'contain',
    marginRight: 6,
  },
  stopText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  messageText: {
    marginBottom: 16,
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
});
const Ask = ({ ask, onPress, onSharePress, wrapperStyle }) => {
  let image = null;
  if (ask.photo) {
    image = (<Image source={{ uri: ask.photo }} style={{ width: '100%', height: 200 }} />);
  }

  let profileImage = null;
  if (ask.User.photo) {
    profileImage = (<Image source={{ uri: ask.User.photo }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={[styles.feed, wrapperStyle]}>
      <View style={styles.feedContent}>
        <View style={styles.feedTitle}>
          <TouchableOpacity onPress={() => onPress('profile', ask.User.id)}>{profileImage}</TouchableOpacity>
          <View>
            <Text style={styles.lightText}>
              <Text style={styles.name}>
                {ask.User.firstName || ask.User.email}
              </Text>
              <Text> asks for a ride </Text>
            </Text>
            <Text style={styles.fromTo}>{ask.TripStart.name} - {ask.TripEnd.name}</Text>
            <Text style={styles.lightText}>{ask.date}</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => onPress('ask', ask)}>
          <View>
            <View style={styles.info}>
              <Text style={styles.messageText}>{ask.description}</Text>
            </View>
            {image}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.feedAction}>
        <Relation users={ask.User.relation} />
        <View style={styles.verticalDevider} />
        <View style={{ width: '33.33%', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onSharePress('ask', ask)}>
            <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.tabLabel}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalDevider} />
        <View style={{ width: '33.33%', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onPress('ask', ask)}>
            <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.tabLabel}>Comment</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Ask.propTypes = {
  ask: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  wrapperStyle: View.propTypes.style,
};

Ask.defaultProps = {
  wrapperStyle: {},
};

export default Ask;
