import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';

const styles = StyleSheet.create({
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
    height: 35,
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  searchPlaceholder: {
    opacity: 0.65,
  },
});

const ListSearchBar = ({ onSearchPress }) => (
  <TouchableOpacity style={styles.searchInputWrapper} onPress={() => onSearchPress()}>
    <Image
      source={require('@assets/icons/ic_search.png')}
      style={styles.searchIcon}
    />
    <Text style={styles.searchPlaceholder}>Search</Text>
  </TouchableOpacity>
);

ListSearchBar.propTypes = {
  onSearchPress: PropTypes.func.isRequired,
};

export default ListSearchBar;
