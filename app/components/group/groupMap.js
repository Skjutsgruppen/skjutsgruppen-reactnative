import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

const cardHeight = 420;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.75,
  },
});

const GroupMap = ({ group, onMapPress }) => (
  <TouchableOpacity onPress={onMapPress} style={styles.wrapper}>
    <Image
      source={{ uri: group.mapPhoto }}
      style={styles.img}
    />
  </TouchableOpacity>
);

GroupMap.propTypes = {
  group: PropTypes.shape({
    mapPhoto: PropTypes.string,
  }).isRequired,
  onMapPress: PropTypes.func.isRequired,
};


export default GroupMap;
