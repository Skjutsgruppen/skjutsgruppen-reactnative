import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Title, AppText } from '@components/utils/texts';
import { withNavigation } from 'react-navigation';
import GroupImage from '@assets/onboarding_group.png';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    minHeight: Dimensions.get('window').height,
    backgroundColor: Colors.background.fullWhite,
  },
  info: {
    maxWidth: 230,
    lineHeight: 40,
    letterSpacing: 0.75,
    marginTop: 16,
  },
  image: {
    maxWidth: '100%',
    maxHeight: '55%',
    resizeMode: 'contain',
    marginVertical: 24,
  },
  next: {
    color: Colors.text.blue,
    paddingVertical: 16,
    paddingHorizontal: 50,
    marginTop: 'auto',
    marginBottom: '8%',
  },
});

const Welcome = ({ navigation }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={GroupImage} />
    <Title centered size={24} color={Colors.text.gray} style={styles.info}>
      {trans('onboarding.add_or_join_groups_for_a_specific_distance')}
    </Title>
    <AppText
      fontVariation="semibold"
      onPress={() => navigation.navigate('Boarding')}
      style={styles.next}
    >
      {trans('global.next')}</AppText>
  </View>
);

Welcome.navigationOptions = {
  header: null,
};

Welcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Welcome);
