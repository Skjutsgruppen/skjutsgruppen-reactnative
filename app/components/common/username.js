import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const Username = ({ name, style, onPress }) => (
  <AppText color={Colors.text.blue} fontVariation="bold" style={style} onPress={onPress}>{name} </AppText>
);


Username.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: Text.propTypes.style,
};

Username.defaultProps = {
  onPress: () => {},
  style: {},
};

export default Username;
