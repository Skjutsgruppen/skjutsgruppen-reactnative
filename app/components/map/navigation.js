import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import FileterIcon from '@icons/ic_menu_blue.png';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 74,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.15,
  },
  backIcon: {
    backgroundColor: Colors.background.blue,
    borderWidth: 5,
    borderColor: Colors.border.white,
  },
  filteIconWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
});

const MapNavigation = ({ onPressBack, onPressFilter }) => (
  <View style={styles.wrapper}>
    <TouchableOpacity style={[styles.iconWrapper, styles.backIcon]} onPress={onPressBack} />
    <TouchableOpacity style={[styles.iconWrapper, styles.filteIconWrapper]} onPress={onPressFilter}>
      <Image source={FileterIcon} />
    </TouchableOpacity>
  </View>
);

MapNavigation.propTypes = {
  onPressBack: PropTypes.func,
  onPressFilter: PropTypes.func,
};

MapNavigation.defaultProps = {
  onPressBack: () => {},
  onPressFilter: () => {},
};

export default MapNavigation;
