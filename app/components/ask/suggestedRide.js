import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Avatar } from '@components/common';
import Date from '@components/date';
import Radio from '@components/add/radio';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  lightText: {
    color: Colors.text.gray,
  },
});

const SuggestedRide = ({ ride, onSelect, selectedId }) => (
  <TouchableHighlight
    onPress={() => onSelect(ride.id)}
    underlayColor="#f5f5f5"
    style={{ backgroundColor: Colors.background.mutedBlue }}
  >
    <View style={styles.wrapper}>
      <Avatar
        imageURI={ride.User.avatar}
        size={48}
        notTouchable
      />
      <View style={styles.content}>
        <Text>{ride.TripStart.name
          || ride.direction.charAt(0).toUpperCase() + ride.direction.slice(1)
        } - {ride.TripEnd.name ||
          ride.direction.charAt(0).toUpperCase() + ride.direction.slice(1)}</Text>
        <Text style={styles.lightText}><Date format="MMM DD, YYYY, HH:mm">{ride.date}</Date></Text>
      </View>
      <Radio
        active={ride.id === selectedId}
        onPress={() => onSelect(ride.id)}
        style={{ marginLeft: 'auto' }}
      />
    </View>
  </TouchableHighlight>
);

SuggestedRide.propTypes = {
  ride: PropTypes.shape({
    User: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
    }),
    TripStart: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    TripEnd: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
};

SuggestedRide.defaultProps = {
  selectedId: null,
};

export default SuggestedRide;
