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
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  stopText: {
    color: '#00000077',
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
const Feed = ({ offer, onPress, onSharePress }) => {
  let image = null;
  if (offer.photo) {
    image = (<Image source={{ uri: offer.photo }} style={{ width: '100%', height: 200 }} />);
  }


  let profileImage = null;
  if (offer.User.photo) {
    profileImage = (<Image source={{ uri: offer.User.photo }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={styles.feed}>
      <View style={styles.feedContent}>
        <View style={styles.feedTitle}>
          {profileImage}
          <View>
            <Text style={styles.lightText}>
              <Text style={styles.name}>
                {offer.User.firstName || offer.User.email}
              </Text>
              <Text> offers {offer.seats} {offer.seats > 1 ? 'seats' : 'seat'} </Text>
            </Text>
            <Text>{offer.TripStart.name} - {offer.TripEnd.name}</Text>
            <Text style={styles.lightText}>{offer.date}</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => onPress('offer', offer)}>
          <View>
            {image}
            <View style={styles.info}>
              <Text style={styles.stopText}>
                Stops in
                <Text> {offer.Stops.map(place => place.name).join(', ')}</Text>
              </Text>
              <Text style={styles.messageText}>{offer.comment}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.feedAction}>
        <Relation users={offer.User.relation} />
        <View style={styles.verticalDevider} />
        <View style={{ width: '33.33%', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onSharePress('offer', offer)}>
            <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.tabLabel}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalDevider} />
        <View style={{ width: '33.33%', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onPress('offer', offer)}>
            <View style={{ height: 48, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.tabLabel}>Comment</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Feed.propTypes = {
  offer: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Feed;
