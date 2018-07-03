import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import { RoundedButton } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import MapImage from '@assets/security_map.png';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  text: {
    color: Colors.text.gray,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    width: 200,
    marginTop: 48,
    marginBottom: 50,
  },
  image: {
    maxWidth: '100%',
    resizeMode: 'contain',
    marginTop: 24,
  },
});

class Info extends Component {
  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  render() {
    return (
      <View style={styles.paddedSection}>
        <StepsHeading>{trans('onboarding.increase_trust_and_security')}</StepsHeading>
        <StepsTitle>
          {trans('onboarding.your_number_is_confirmed')}
          {'\n'}
          {trans('onboarding.now_you_will_sync_your_phone_book')}
        </StepsTitle>
        <Image source={MapImage} style={styles.image} />
        <AppText style={styles.text}>
          {trans('onboarding.you_will_be_able_to_send_your_live_location_with_SMS')}
        </AppText>
        <RoundedButton
          onPress={this.onNext}
          style={styles.button}
          bgColor={Colors.background.pink}
        >
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }
}

Info.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Info;
