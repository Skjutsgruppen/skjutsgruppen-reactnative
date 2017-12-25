import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import Map from '@assets/map_toggle.png';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  mapImg: {
    resizeMode: 'contain',
  },
});

const MapToggle = ({ handlePress }) => (
  <View style={styles.wrapper} >
    <TouchableOpacity onPress={handlePress} style={styles.mapWrapper}>
      <Image source={Map} style={styles.mapImg} />
    </TouchableOpacity>
  </View>
);

MapToggle.propTypes = {
  handlePress: PropTypes.func,
};

MapToggle.defaultProps = {
  handlePress: () => { },
};

export default MapToggle;
