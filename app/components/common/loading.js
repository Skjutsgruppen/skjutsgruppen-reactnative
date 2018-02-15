import React from 'react';
import { ActivityIndicator as Loader } from 'react-native';
import PropTypes from 'prop-types';

const Loading = ({ style, size }) => <Loader size={size} color="#00aeef" style={style} />;

Loading.propTypes = {
  style: Loader.propTypes.style,
  size: PropTypes.string,
};

Loading.defaultProps = {
  style: {},
  size: 'large',
};

export default Loading;
