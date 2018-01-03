import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

const ProfilePicture = ({ source, size, style }) => {
  const ownStyle = {
    height: size,
    width: size,
    resizeMode: 'cover',
    borderRadius: size / 2,
    ...style,
  };

  return (
    <Image source={source} style={ownStyle} />
  );
};

ProfilePicture.propTypes = {
  source: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  style: Image.propTypes.style,
};

ProfilePicture.defaultProps = {
  style: {},
};

export default ProfilePicture;
