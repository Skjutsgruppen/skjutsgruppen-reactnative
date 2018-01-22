import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@assets/icons/ic_chevron_left.png';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 2,
  },
  iconWrapper: {
    height: 32,
    width: 32,
    borderRadius: 16,
    elevation: 2,
  },
  icon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
});

const FloatingBackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <View style={styles.iconWrapper}>
      <Image source={Icon} style={styles.icon} />
    </View>
  </TouchableOpacity>
);

FloatingBackButton.propTypes = {
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
};

FloatingBackButton.defaultProps = {
  style: {},
};

export default FloatingBackButton;
