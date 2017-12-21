import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const cardHeight = 484;

const styles = StyleSheet.create({
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    overflow: 'hidden',
    backgroundColor: Colors.background.gray,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  groupName: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
    marginHorizontal: 24,
    textAlign: 'center',
  },
});

const GroupImage = ({ imageURI, name }) => (
  <View>
    <View style={styles.imgWrapper}>
      <Image source={{ uri: imageURI }} style={styles.img} />
      <Text style={styles.groupName}>{name}</Text>
    </View>
  </View>
);

GroupImage.propTypes = {
  imageURI: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default GroupImage;
