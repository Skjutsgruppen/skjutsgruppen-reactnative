import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import AppText from '@components/utils/texts/appText';
import Radio from '@components/add/radio';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import BackButton from '@components/onBoarding/backButton';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
  },
  header: {
    lineHeight: 46,
    marginTop: 24,
  },
  title: {
    lineHeight: 36,
    marginVertical: 16,
  },
  button: {
    alignSelf: 'center',
    width: 200,
    marginVertical: 40,
  },
  radioWrapper: {
    marginVertical: 18,
  },
  horizontalDivider: {
    width: 64,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background.lightGray,
    marginVertical: 12,
  },
  text: {
    lineHeight: 30,
  },
});

class Agreement extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      agreementChecked: false,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  onAgreementCheck = () => {
    const { agreementChecked } = this.state;

    this.setState({ agreementChecked: !agreementChecked });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.navigate('Boarding');
    // navigation.goBack();
  }

  render() {
    const { agreementChecked } = this.state;

    return (
      <ScrollView style={styles.wrapper}>
        <StepsHeading>
          {trans('onboarding.we_are_friends_of_friends_of_friends')}
        </StepsHeading>
        <StepsTitle>
          {trans('onboarding.we_share_equally_of_offer_each_other_rides')}
        </StepsTitle>
        <View style={styles.radioWrapper}>
          <Radio
            active={agreementChecked}
            label={trans('onboarding.i_agree')}
            onPress={this.onAgreementCheck}
          />
        </View>
        <View style={styles.horizontalDivider} />
        <AppText style={styles.text}>
          {trans('onboarding.by_clicking_i_agree_you_agree_to_participatory')}
        </AppText>
        <AppText
          onPress={() => Linking.openURL('https://web.skjutsgruppen.nu/participant-agreement')}
          style={styles.text}
          color={Colors.text.blue}
          fontVariation="bold"
        >
          {trans('onboarding.read_all_of_the_agreement_here')}
        </AppText>
        <RoundedButton
          onPress={this.onNext}
          style={styles.button}
          bgColor={agreementChecked ? Colors.background.pink : Colors.background.lightGray}
          disabled={!agreementChecked}
        >
          {trans('global.next')}
        </RoundedButton>
        <BackButton onPress={this.goBack} />
      </ScrollView>
    );
  }
}

Agreement.propTypes = {
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Agreement);
