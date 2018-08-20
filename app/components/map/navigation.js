import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import BackIcon from '@assets/icons/ic_back_toolbar.png';
import Filter from '@components/feed/filter';

import Colors from '@theme/colors';

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
  backIconWrapper: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
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

const MapNavigation = ({ onPressBack, onPressFilter, arrowBackIcon, showMenu }) => (
  <View style={styles.wrapper}>
    {arrowBackIcon
      ? <TouchableOpacity style={styles.backIconWrapper} onPress={onPressBack}>
        <Image style={{ transform: [{ rotate: '90deg' }] }} source={BackIcon} />
      </TouchableOpacity>
      : <TouchableOpacity style={[styles.iconWrapper, styles.backIcon]} onPress={onPressBack} />}
    {showMenu &&
      <View style={[styles.iconWrapper, styles.filteIconWrapper]}>
        <Filter
          map
          onPress={onPressFilter}
        />
      </View>
    }
  </View>
);

MapNavigation.propTypes = {
  onPressBack: PropTypes.func,
  onPressFilter: PropTypes.func,
  arrowBackIcon: PropTypes.bool,
  showMenu: PropTypes.bool,
};

MapNavigation.defaultProps = {
  onPressBack: () => { },
  onPressFilter: () => { },
  arrowBackIcon: false,
  showMenu: true,
};

export default MapNavigation;
