import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@assets/icons/ic_chevron_left.png';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 2,
  },
  iconWrapper: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
    elevation: 2,
  },
});

const FloatingBackButton = ({ style, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <View style={styles.iconWrapper}>
      <Image source={Icon} />
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
