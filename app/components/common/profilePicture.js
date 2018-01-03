import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

const ProfilePicture = ({ source, size, style, ...props }) => {
  const ownStyle = {
    height: size,
    width: size,
    resizeMode: 'cover',
    borderRadius: size / 2,
    ...style,
  };

  return (
    <Image source={{ uri: source }} style={ownStyle} {...props} />
  );
};

ProfilePicture.propTypes = {
  source: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  style: Image.propTypes.style,
};

ProfilePicture.defaultProps = {
  style: {},
};

export default ProfilePicture;
