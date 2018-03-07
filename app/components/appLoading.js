import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import Logo from '@assets/icons/logo.png';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class AppLoading extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Image source={Logo} />
      </View>
    );
  }
}

export default AppLoading;
