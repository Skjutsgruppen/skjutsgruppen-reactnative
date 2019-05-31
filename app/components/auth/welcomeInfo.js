import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { Title } from '@components/utils/texts';
import { withNavigation } from 'react-navigation';
import Logo from '@assets/logo.png';
import MapImage from '@assets/onboarding_map.png';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    minHeight: Dimensions.get('window').height,
    backgroundColor: Colors.background.fullWhite,
  },
  logo: {
    maxHeight: Dimensions.get('window').height * 0.4,
    resizeMode: 'contain',
    marginTop: 48,
    marginBottom: 44,
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
  <View style={styles.wrapper}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Welcome')} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Image source={Logo} style={styles.logo} />
          <Title centered size={24} color={Colors.text.gray} style={styles.info}>
            { trans('onboarding.welcome_to_skjutsgruppen') }
          </Title>
          <Image source={MapImage} style={styles.map} />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  </View>
);

WelcomeInfo.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(WelcomeInfo);
