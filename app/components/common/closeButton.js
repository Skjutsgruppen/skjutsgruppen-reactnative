import React from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

import DownIcon from '@assets/icons/icon_chevron_down.png';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  icon: {
    width: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
});

const CloseButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={DownIcon} style={styles.icon} />
    <AppText size={13} color={Colors.text.gray} fontVariation="bold">Close</AppText>
  </TouchableOpacity>
);

CloseButton.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
};

CloseButton.defaultProps = {
  style: {},
};

export default CloseButton;
