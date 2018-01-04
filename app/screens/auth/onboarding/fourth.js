import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { ColoredText } from '@components/auth/texts';
import { CustomButton } from '@components/common';
import BackButton from '@components/auth/backButton';
import Colors from '@theme/colors';

import GardenIcon from '@assets/icons/icon_garden.png';

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  garden: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 50,
  },
  button: {
    marginTop: 24,
  },
});

const Fourth = ({ navigation }) => (
  <ScrollView>
    <View style={styles.wrapper}>
      <Image source={GardenIcon} style={styles.garden} />
      <ColoredText
        color={Colors.text.purple}
        style={{ width: '100%', fontSize: 20, lineHeight: 36, marginBottom: '10%' }}
      >
        This app is self sustaining garden.
      </ColoredText>
      <ColoredText
        color={Colors.text.green}
        style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
      >
        Together we give a little of our money to pay for what is needed for the app to work.
      </ColoredText>
      <ColoredText
        color={Colors.text.blue}
        style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
      >
        {"Your are free to help with this, if you want. But you don't have to, the app is free to use."}
      </ColoredText>
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => navigation.navigate('OnBoardingFifth')}
      >
        Sounds good!
      </CustomButton>
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  </ScrollView>
);

Fourth.navigationOptions = {
  header: null,
};

Fourth.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};
export default Fourth;
