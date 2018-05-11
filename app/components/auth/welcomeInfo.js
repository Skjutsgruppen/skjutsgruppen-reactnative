import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { Title } from '@components/utils/texts';
import { withNavigation } from 'react-navigation';
import Logo from '@assets/icons/logo.png';
import MapImage from '@assets/onboarding_map.png';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    minHeight: Dimensions.get('window').height,
    backgroundColor: Colors.background.fullWhite,
  },
  logo: {
    maxWidth: '70%',
    resizeMode: 'contain',
    marginTop: '5%',
    marginBottom: 12,
  },
  info: {
    lineHeight: 36,
    maxWidth: 310,
    letterSpacing: 0.75,
  },
  map: {
    maxWidth: '100%',
    resizeMode: 'cover',
    marginTop: 'auto',
  },
});

const WelcomeInfo = ({ navigation }) => (
  <ScrollView>
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Welcome')} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Image source={Logo} style={styles.logo} />
        <Title centered size={24} color={Colors.text.gray} style={styles.info}>
          Welcome to the non-profit ridesharing movement Skjutsgruppen
        </Title>
        <Image source={MapImage} style={styles.map} />
      </View>
    </TouchableWithoutFeedback>
  </ScrollView>
);

WelcomeInfo.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(WelcomeInfo);
