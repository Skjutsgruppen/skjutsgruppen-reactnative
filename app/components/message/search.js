import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image } from 'react-native';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  header: {
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  iconWrapper: {
    height: 36,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  searchInput: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    height: 36,
    flex: 1,
    paddingLeft: 18,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
});


const Search = () => (
  <View style={styles.header}>
    <AppText size={18} centered fontVariation="bold">Messages and groups</AppText>
    <View style={styles.searchInputWrapper}>
      <TextInput
        placeholder="Search"
        underlineColorAndroid="transparent"
        style={styles.searchInput}
      />
      <TouchableOpacity style={styles.iconWrapper}>
        <Image
          source={require('@assets/icons/icon_search_blue.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default Search;
