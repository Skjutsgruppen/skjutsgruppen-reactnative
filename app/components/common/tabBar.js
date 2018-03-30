import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { withNavigation } from 'react-navigation';

import { APP_TABS_COUNT } from '@config/constant';

import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },
  buttonWrapper: {
    width: Dimensions.get('window').width / APP_TABS_COUNT,
    height: 60,

  },
  button: {
    flex: 1,
    width: Dimensions.get('window').width / APP_TABS_COUNT,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabBar = ({ navigation }) => (
  <View style={styles.wrapper}>
    <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Feed')}>
      <Image source={require('@assets/icons/ic_feed.png')} />
    </TouchableHighlight>
    <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Add')}>
      <Image source={require('@assets/icons/ic_add.png')} />
    </TouchableHighlight>
    <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Search')}>
      <Image source={require('@assets/icons/ic_search.png')} />
    </TouchableHighlight>
    <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Message')}>
      <Image source={require('@assets/icons/ic_message.png')} />
    </TouchableHighlight>
    <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Garden')}>
      <Image source={require('@assets/icons/ic_support.png')} />
    </TouchableHighlight>
  </View>
);

TabBar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(TabBar);
