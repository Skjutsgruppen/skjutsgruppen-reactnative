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

const Second = ({ navigation }) => (
  <ScrollView>
    <View style={styles.wrapper}>
      <View style={styles.circle} />
      <ColoredText
        color={Colors.text.green}
        style={{ width: '100%', fontSize: 20, lineHeight: 36, marginBottom: '10%' }}
      >
        When we’re going the same direction we offer our spare seats to each other.
      </ColoredText>
      <ColoredText
        color={Colors.text.purple}
        style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
      >
        We share the costs of our rides equally or offer each other rides for free.
      </ColoredText>
      <ColoredText
        color={Colors.text.blue}
        style={{ width: 200, fontSize: 20, lineHeight: 36 }}
      >
        Because friends don’t make money of friends
      </ColoredText>
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => navigation.navigate('OnBoardingThird')}
      >
        Sweet!
      </CustomButton>
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  </ScrollView>
);

Second.navigationOptions = {
  header: null,
};

Second.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};


export default Second;
