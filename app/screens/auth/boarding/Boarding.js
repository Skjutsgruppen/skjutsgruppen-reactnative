import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { Title, AppText } from '@components/utils/texts';
import { RoundedButton } from '@components/common';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  title: {
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 0.75,
    marginVertical: '25%',
  },
  button: {
    width: 200,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 60,
  },
  separatorLine: {
    width: 200,
    height: 1,
    backgroundColor: Colors.background.lightGray,
    top: 11,
  },
  separatorText: {
    color: Colors.text.blue,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 16,
  },
});

const Boarding = ({ navigation }) => (
  <View style={styles.wrapper}>
    <Title centered size={24} color={Colors.text.gray} style={styles.title}>
      Lets get started!
    </Title>
    <RoundedButton
      bgColor={Colors.background.pink}
      onPress={() => navigation.navigate('Onboarding')}
      style={styles.button}
    >New participant</RoundedButton>
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
      <AppText fontVariation="semibold" style={styles.separatorText}>OR</AppText>
    </View>
    <RoundedButton
      bgColor={Colors.background.blue}
      onPress={() => navigation.navigate('LoginMethod')}
      style={styles.button}
    >Login</RoundedButton>
  </View>
);

Boarding.navigationOptions = {
  header: null,
};

Boarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Boarding);
