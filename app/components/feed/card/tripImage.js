import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.gray,
  },
  img: {
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

const TripImage = ({ imageURI, height }) => (
  <View style={[styles.wrapper, { height }]}>
    <Image source={{ uri: imageURI }} style={[styles.img, { height }]} />
  </View>
);

TripImage.propTypes = {
  imageURI: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
};

export default TripImage;
