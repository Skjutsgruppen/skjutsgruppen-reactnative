import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';

const styles = StyleSheet.create({
  imgWrapper: {
    padding: 20,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: '12%',
    elevation: 15,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
  },
  img: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 50,
  },
});

const CapturedImage = ({ imageURI, style }) => (
  <View style={[styles.imgWrapper, style]}>
    <Image
      source={{
        isStatic: true,
        uri: imageURI,
      }}
      style={styles.img}
    />
  </View>
);

CapturedImage.propTypes = {
  imageURI: PropTypes.string.isRequired,
  style: View.propTypes.style,
};

CapturedImage.defaultProps = {
  style: {},
};
export default CapturedImage;
