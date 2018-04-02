import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';
import FBLogin from '@components/facebook/login';
import TwitterLogin from '@components/twitter/login';

const styles = StyleSheet.create({
  garderIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },
  divider: {
    alignSelf: 'center',
    width: '70%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
  notParticipantWrapper: {
    marginHorizontal: 32,
    marginTop: 50,
    marginBottom: 32,
  },
  notParticipant: {
    textAlign: 'center',
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

  onPressEmail = () => {
    this.props.navigation.navigate('LoginViaEmail');
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <Image source={require('@assets/icons/icon_garden.png')} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>Welcome back!</GreetText>

        <View style={styles.button}>
          <FBLogin />
        </View>
        <View style={styles.button}>
          <TwitterLogin />
        </View>
        <View style={styles.divider} />
        <ColoredText color={Colors.text.purple}>Or</ColoredText>
        <CustomButton
          bgColor={Colors.background.gray}
          onPress={this.onPressEmail}
          style={styles.button}
        >
          Sign in with number or name
        </CustomButton>
        <TouchableOpacity style={styles.notParticipantWrapper} onPress={this.onPressBack}>
          <Text style={styles.notParticipant}>{'I\'m not a participant yet'}</Text>
        </TouchableOpacity>
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
