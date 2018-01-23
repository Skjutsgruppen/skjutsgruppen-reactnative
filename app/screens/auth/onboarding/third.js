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
    paddingHorizontal: 24,
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
    marginTop: 24,
  },
});

const Third = ({ navigation }) => (
  <ScrollView>
    <View style={styles.wrapper}>
      <View style={styles.circle} />
      <ColoredText
        color={Colors.text.green}
        style={{ width: '100%', fontSize: 20, lineHeight: 36, marginBottom: '10%' }}
      >
        We also share everything else.
      </ColoredText>
      <ColoredText
        color={Colors.text.purple}
        style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
      >
        We have democratic non-profit association where we take decisions together.
      </ColoredText>
      <ColoredText
        color={Colors.text.blue}
        style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
      >
        Our code is open source in Github so everyone can make this app better.
      </ColoredText>
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => navigation.navigate('OnBoardingFourth')}
      >
        Sweet!
      </CustomButton>
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  </ScrollView>
);

Third.navigationOptions = {
  header: null,
};

Third.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};


export default Third;
