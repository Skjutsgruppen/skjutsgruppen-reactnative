import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
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
  button: {
    margin: 24,
  },
});

class MobileVerified extends Component {
  static navigationOptions = {
    header: null,
  };

  onEnter = () => {
    const { navigation } = this.props;
    navigation.navigate('Feed');
  }

  render() {
    return (
      <Container>
        <Image source={require('@assets/profile_pic.jpg')} style={styles.profilePic} />
        <GreetText>Your number is confirmed!</GreetText>
        <ColoredText color={Colors.text.blue}>Welcome Johline!</ColoredText>
        <ColoredText color={Colors.text.purple}>
          You are now part of the non-profit ridesharing movement Skjutsgruppen!
        </ColoredText>
        <ColoredText color={Colors.text.green}>
          We are looking forward to rideshare with you!
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          Press enter to start looking arround and say hi to other participants
        </ColoredText>
        <CustomButton
          style={styles.button}
          onPress={this.onEnter}
          bgColor={Colors.background.green}
        >
          Enter
        </CustomButton>
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
