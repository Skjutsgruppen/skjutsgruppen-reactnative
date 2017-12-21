import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import Relation from '@components/relation';
import PropTypes from 'prop-types';
import Date from '@components/date';

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
    height: 200,
    marginBottom: 16,
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
    paddingHorizontal: 12,
  },
  stopIcon: {
    width: 12,
    resizeMode: 'contain',
    marginRight: 6,
  },
  stopText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    marginTop: 12,
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
const Offer = ({ offer, onPress, onSharePress, wrapperStyle }) => {
  let image = null;
  if (offer.photo) {
    image = (<Image source={{ uri: offer.photo }} style={styles.feedImg} />);
  }

  let profileImage = null;

  if (offer.User.avatar) {
    profileImage = (<Image source={{ uri: offer.User.avatar }} style={styles.profilePic} />);
  } else {
    profileImage = (<View style={styles.imgIcon} />);
  }

  return (
    <View style={[styles.feed, wrapperStyle]}>
      <View style={styles.feedContent}>
        <View style={styles.feedTitle}>
          <TouchableOpacity onPress={() => onPress('profile', offer.User.id)}>{profileImage}</TouchableOpacity>
          <View>
            <Text style={styles.lightText}>
              <Text style={styles.name}>
                {offer.User.firstName || offer.User.email}
              </Text>
              <Text> offers {offer.seats} {offer.seats > 1 ? 'seats' : 'seat'} </Text>
            </Text>
            <Text style={styles.fromTo}>{offer.TripStart.name} - {offer.TripEnd.name}</Text>
            <Text style={styles.lightText}><Date>{offer.date}</Date></Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => onPress('offer', offer)}>
          <View>
            {image}
            <View style={styles.info}>
              {
                offer.Stops.length > 0 &&
                <View style={styles.stopText}>
                  <Image source={require('@icons/icon_stops.png')} style={styles.stopIcon} />
                  <Text style={styles.lightText}>Stops in {offer.Stops.map(place => place.name).join(', ')}</Text>
                </View>
              }
              <Text style={styles.messageText}>{offer.description}</Text>
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
