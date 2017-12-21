import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { CustomButton } from '@components/common';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import PropTypes from 'prop-types';
import FBLogin from '@components/facebook/login';

const styles = StyleSheet.create({
  garderIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  divider: {
    alignSelf: 'center',
    width: '70%',
    height: 1,
    marginVertical: 24,
    backgroundColor: Colors.background.lightGray,
  },
  backButton: {
    textAlign: 'center',
    margin: 32,
    textDecorationLine: 'underline',
    textDecorationColor: '#333',
    color: '#333',
  },
  button: {
    marginHorizontal: 24,
  },
});

class Method extends Component {
  static navigationOptions = {
    header: null,
  };

  onPressFacebook = () => {

  };

  onPressTwitter = () => {

  };

  onPressEmail = () => {
    this.props.navigation.navigate('RegisterViaEmail');
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <Image source={require('@icons/icon_garden.png')} style={styles.garderIcon} />
        <GreetText>Thanks for agreeing!</GreetText>
        <ColoredText color={Colors.text.blue}>
          We recommend you sign in with Facebook or Twitter
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          We will not post anything to Facebook or Twitter without asking you.
        </ColoredText>
        <View style={styles.button}>
          {/* <FBLogin navigation={this.props.navigation} /> */}
        </View>
        <CustomButton
          style={styles.button}
          onPress={this.onPressTwitter}
          bgColor="#1da1f2"
        >
          Sign in with Twitter
        </CustomButton>
        <View style={styles.divider} />
        <ColoredText color={Colors.text.purple}>
          {'or do the old school and a bitter longer sign up process (that\'s ok as well)'}
        </ColoredText>
        <CustomButton
          style={styles.button}
          bgColor={Colors.background.gray}
          onPress={this.onPressEmail}
        >
          Sign up the long way
        </CustomButton>
        <BackButton onPress={this.onPressBack} />
      </Container>
    );
  }
}

Method.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default Method;
