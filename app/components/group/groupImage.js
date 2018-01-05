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
  roundedCorner: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    overflow: 'hidden',
    backgroundColor: Colors.background.black,
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
  name: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
    marginHorizontal: 24,
    textAlign: 'center',
  },
});

const GroupImage = ({ group, wrapperStyle, roundedCorner }) => {
  let source = null;
  if (group.photo) {
    source = { uri: group.photo };
  } else if (group.mapPhoto) {
    source = { uri: group.mapPhoto };
  } else {
    source = require('@assets/feed-img.jpg');
  }

  return (
    <View style={[styles.wrapper, wrapperStyle, roundedCorner && styles.roundedCorner]}>
      <Image
        source={source}
        style={[styles.img, roundedCorner && styles.roundedCorner]}
      />
      <Text style={styles.name}>{group.name}</Text>
    </View>
  );
};

GroupImage.propTypes = {
  group: PropTypes.shape({
    imageURI: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  wrapperStyle: View.propTypes.style,
  roundedCorner: PropTypes.bool,
};

GroupImage.defaultProps = {
  wrapperStyle: {},
  roundedCorner: false,
};

export default GroupImage;
