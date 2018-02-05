import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import { FEEDABLE_TRIP } from '@config/constant';
import Date from '@components/date';
import { Avatar } from '@components/common';
import { Colors } from '@theme';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lightText: {
    color: Colors.text.gray,
  },
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 10,
  },
  infoWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
});

const ListItem = ({ trip, onPress, onExperiencePress }) => (
  <TouchableHighlight
    onPress={() => onPress(FEEDABLE_TRIP, trip)}
    style={styles.wrapper}
    underlayColor={Colors.background.mutedPink}
  >
    <View style={styles.flexRow}>
      <Avatar imageURI={trip.User.avatar} size={46} onPress={() => onPress(trip.User.id)} />
      <View style={styles.infoWrapper}>
        <Text>
          {trip.TripStart.name} - {trip.TripEnd.name}
        </Text>
        <Text style={styles.lightText}>
          <Date format="MMM DD, HH:mm">{trip.date}</Date>
        </Text>
      </View>
      {trip.experienceStatus !== 'canCreate' && trip.experienceStatus === 'published'
        && <TouchableOpacity
          onPress={() => onExperiencePress(trip.ownerExperience)}
        >
          <Image source={ExperienceIcon} />
        </TouchableOpacity>}
    </View>
  </TouchableHighlight>
);

ListItem.propTypes = {
  onExperiencePress: PropTypes.func.isRequired,
  trip: PropTypes.shape({
    User: PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    }),
    TripStart: PropTypes.shape({
      name: PropTypes.string,
    }),
    TripEnd: PropTypes.shape({
      name: PropTypes.string,
    }),
    date: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ListItem;
