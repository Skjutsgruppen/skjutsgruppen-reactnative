import React from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  icon: {
    height: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
});

const BackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={require('@assets/icons/ic_back_toolbar.png')} style={styles.icon} />
    <AppText size={13} color={Colors.text.darkGray} fontVariation="bold">Back</AppText>
  </TouchableOpacity>
);

BackButton.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
};

BackButton.defaultProps = {
  style: {},
};

export default BackButton;
