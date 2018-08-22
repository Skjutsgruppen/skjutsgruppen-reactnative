import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import Colors from '@theme/colors';
import Logo from '@assets/logo.png';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.mutedBlue,
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
