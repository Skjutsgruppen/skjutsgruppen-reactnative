import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import LeafIcon from '@assets/icons/ic_leaf.png';

const styles = StyleSheet.create({
  leaf: {
    resizeMode: 'contain',
    position: 'absolute',
    bottom: -2,
    right: 0,
  },
});

const Avatar = ({ imageURI, notTouchable, size, style, onPress, isSupporter, ...props }) => {
  const wrapperStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };
  const avatarStyle = {
    height: size,
    width: size,
    resizeMode: 'cover',
    borderRadius: size / 2,
  };

  const leafSize = parseInt(size * 0.3, 0);

  if (notTouchable) {
    return (
      <View style={[{ ...wrapperStyle }, style]}>
        {imageURI !== '' && <Image source={{ uri: imageURI }} style={avatarStyle} {...props} />}
        {
          isSupporter && <Image
            source={LeafIcon}
            style={[styles.leaf, { height: leafSize, width: leafSize }]}
          />
        }
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[{ ...wrapperStyle }, style]}>
      <Image source={{ uri: imageURI }} style={avatarStyle} {...props} />
      {
        isSupporter && <Image
          source={LeafIcon}
          style={[styles.leaf, { height: leafSize, width: leafSize }]}
        />
      }
    </TouchableOpacity>
  );
};

Avatar.propTypes = {
  imageURI: PropTypes.string,
  isSupporter: PropTypes.bool,
  notTouchable: PropTypes.bool,
  size: PropTypes.number.isRequired,
  style: Image.propTypes.style,
  onPress: PropTypes.func,
};

Avatar.defaultProps = {
  isSupporter: false,
  notTouchable: false,
  style: {},
  imageURI: '',
  onPress: () => { },
};

export default Avatar;
