import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { trans } from '@lang/i18n';
import { RoundedButton } from '@components/common';
import PropTypes from 'prop-types';
import FBLogin from '@components/facebook/login';
import TwitterLogin from '@components/twitter/login';
import StepsHeading from '@components/onBoarding/stepsHeading';
import { withNavigation } from 'react-navigation';
import BackButton from '@components/onBoarding/backButton';
import StepsTitle from '@components/onBoarding/stepsTitle';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 30,
    backgroundColor: Colors.background.fullWhite,
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
    width: 200,
  },
  emailButton: {
    width: 200,
    marginVertical: 24,
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
      <Container style={{ backgroundColor: Colors.background.fullWhite }}>
        <View style={styles.mainContainer}>
          <StepsHeading>{trans('onboarding.welcome_back')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.login_with_fb_twitter_or_your_email')}
          </StepsTitle>
          <View style={styles.button}>
            <FBLogin />
          </View>
          <View style={styles.button}>
            <TwitterLogin />
          </View>
          <RoundedButton
            onPress={this.onPressEmail}
            style={styles.emailButton}
            bgColor={Colors.background.pink}
          >
            {trans('onboarding.email_phone')}
          </RoundedButton>
          <BackButton style={{ paddingVertical: 70 }} leftAligned onPress={this.onPressBack} />
        </View>
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

export default withNavigation(Method);
