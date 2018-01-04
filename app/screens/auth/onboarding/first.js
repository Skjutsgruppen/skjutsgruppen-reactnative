import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { ColoredText } from '@components/auth/texts';
import { CustomButton } from '@components/common';
import BackButton from '@components/auth/backButton';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 32,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.background.gray,
    alignSelf: 'center',
    marginVertical: 50,
  },
  button: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});

const First = ({ navigation }) => (
  <ScrollView>
    <View style={styles.wrapper}>
      <View style={styles.circle} />
      <ColoredText
        color={Colors.text.purple}
        style={{ fontSize: 20, width: 220, lineHeight: 36, marginBottom: 32 }}
      >
        We’re super glad you want to participate in the movement!
      </ColoredText>
      <ColoredText
        color={Colors.text.green}
        style={{ fontSize: 20, width: 150, lineHeight: 36 }}
      >
        We are friends and friends of friends. We’re getting closer to each other.
      </ColoredText>
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => navigation.navigate('OnBoardingSecond')}
      >
        Cool!
      </CustomButton>
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  </ScrollView>
);


First.navigationOptions = {
  header: null,
};

First.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default First;
