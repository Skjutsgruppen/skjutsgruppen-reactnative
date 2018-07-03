import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import { RoundedButton } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import RelationImage from '@assets/relation.jpg';

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
    marginTop: 16,
    marginBottom: 24,
  },
});

class Relation extends Component {
  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  render() {
    return (
      <View style={styles.paddedSection}>
        <StepsHeading style={{ maxWidth: 240 }}>{trans('onboarding.increase_trust_and_security')}</StepsHeading>
        <StepsTitle>
          {trans('onboarding.you_will_also_see_how_you_know_all_the_other_participants')}
        </StepsTitle>
        <Image source={RelationImage} style={styles.image} />
        <AppText style={styles.text}>
          {trans('onboarding.if_you_and_another_participant_has_each_others_phone_numbers')}
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

Relation.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Relation;
