import React from 'react';
import { ActivityIndicator as Loader } from 'react-native';

const Loading = ({ style }) => <Loader size="large" color="#00aeef" style={style} />;

Loading.propTypes = {
  style: Loader.propTypes.style,
};

Loading.defaultProps = {
  style: {},
};

export default Loading;
