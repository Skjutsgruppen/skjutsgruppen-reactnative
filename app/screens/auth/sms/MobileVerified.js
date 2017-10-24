import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  profilePic: {
    borderRadius: 65,
    marginBottom: 32,
  },
});

class MobileVerified extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <Image source={require('@assets/profile_pic.jpg')} style={styles.profilePic} />
        <GreetText>your number is confirmed!</GreetText>
        <ColoredText color={Colors.text.blue}>Welcome Johline!</ColoredText>
        <ColoredText color={Colors.text.purple}>
          You are now part of the non-profit {'\n'} ridesharing movement Skjutsgruppen!
        </ColoredText>
        <ColoredText color={Colors.text.green}>
          We are looking forward to rideshare with you!
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          Press enter to start looking arround {'\n'} and say hi to other participants
        </ColoredText>
        <CustomButton onPress={() => navigation.navigate('Feed')} bgColor={Colors.background.green}>Enter</CustomButton>
      </Container>
    );
  }
}

MobileVerified.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default MobileVerified;
