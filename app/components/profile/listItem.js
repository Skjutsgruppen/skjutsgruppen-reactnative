import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import { FEEDABLE_TRIP } from '@config/constant';
import Date from '@components/date';
import Avatar from '@components/common/avatar';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';
import { UcFirst } from '@config';

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
  seats: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.pink,
  },
});

const ListItem = ({ trip, onPress, onExperiencePress, seats, showIndicator, indicatorColor }) => (
  <TouchableHighlight
    onPress={() => onPress(FEEDABLE_TRIP, trip)}
    style={styles.wrapper}
    underlayColor={Colors.background.mutedPink}
  >
    <View style={styles.flexRow}>
      <Avatar
        imageURI={trip.User.avatar}
        size={46}
        onPress={() => onPress(trip.User.id)}
        showIndicator={showIndicator}
        indicatorColor={indicatorColor}
        isSupporter={trip.User.isSupporter}
      />
      <View style={styles.infoWrapper}>
        <AppText>
          {trip.TripStart.name
            || UcFirst(trip.direction)} - {trip.TripEnd.name
              || UcFirst(trip.direction)}
        </AppText>
        <AppText color={Colors.text.gray}>
          <Date format="MMM DD, HH:mm">{trip.date}</Date>
        </AppText>
      </View>
      {
        seats ?
          (<View style={styles.seats}>
            <AppText size={12} color={Colors.text.white}>{seats}</AppText>
          </View>)
          : null
      }
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
  seats: PropTypes.number,
  showIndicator: PropTypes.bool,
  indicatorColor: PropTypes.string,
};

ListItem.defaultProps = {
  seats: null,
  showIndicator: false,
  indicatorColor: 'trasparent',
};

export default ListItem;
