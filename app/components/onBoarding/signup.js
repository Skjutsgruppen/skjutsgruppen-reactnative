import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import FBLogin from '@components/facebook/login';
import TwitterLogin from '@components/twitter/login';
import { RoundedButton } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import BackButton from '@components/onBoarding/backButton';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  button: {
    width: 200,
    marginVertical: 20,
  },
  horizontalDivider: {
    borderWidth: 0.3,
    borderColor: Colors.background.lightGray,
    width: 60,
    marginTop: 20,
  },
  text: {
    paddingVertical: 20,
    color: Colors.text.gray,
  },
  backButton: {
    color: Colors.text.gray,
    paddingTop: 30,
    paddingBottom: 70,
  },
});

class Signup extends Component {
  static navigationOptions = {
    header: null,
  };

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.replace('Onboarding', { activeStep: 2 });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <StepsHeading>{trans('onboarding.welcome_to_the_movement')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.we_recommend_you_to_sign_up_with_facebook_or_twitter')}
          </StepsTitle>
          <StepsTitle>
            {trans('onboarding.we_will_never_publish_without_you_knowing')}
          </StepsTitle>
          <FBLogin signup signupLongWay={this.onNext} />
          <TwitterLogin signup />
          <View style={styles.horizontalDivider} />
          <AppText style={styles.text}>
            {trans('onboarding.sign_up_the_long_way')}
          </AppText>
          <RoundedButton
            onPress={this.onNext}
            style={styles.button}
            bgColor={Colors.background.pink}
          >
            {trans('onboarding.the_long_way')}
          </RoundedButton>
          <BackButton onPress={this.goBack} leftAligned />
        </View>
      </ScrollView>);
  }
}

Signup.propTypes = {
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Signup);
