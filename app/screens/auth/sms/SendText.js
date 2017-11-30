import React, { Component } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { CustomButton } from '@components/common';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  profilePic: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 40,
    marginBottom: 24,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  promise: {
    alignSelf: 'center',
    width: 180,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    opacity: 0.6,
  },
  button: {
    margin: 24,
  },
});


class SendText extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <Image source={require('@assets/profile_pic.jpg')} style={styles.profilePic} />
        <GreetText>Great Johline!</GreetText>
        <ColoredText color={Colors.text.blue}>Your almost done!</ColoredText>
        <ColoredText color={Colors.text.purple}>
          All you need to do now is to confirm you cellphone number!
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          You will confirm by sending a text message with your unique code
          from the phone your are seeing this on right now - to our number.
        </ColoredText>
        <ColoredText color={Colors.text.blue}>Your code:</ColoredText>
        <Text style={styles.code}>0d5956</Text>
        <ColoredText color={Colors.text.green}>
          The text message cost the same as an ordinary texgt message with
          you service provider.
        </ColoredText>
        <CustomButton
          style={styles.button}
          bgColor={Colors.background.green}
          onPress={() => navigation.navigate('MobileVerified')}
        >
          Send text meassage
        </CustomButton>
        <Text style={styles.promise}>We will never give your number to any third parties.</Text>
      </Container>
    );
  }
}

SendText.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default SendText;
