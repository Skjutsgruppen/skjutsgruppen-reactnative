import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import { RoundedButton } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withContactSync } from '@services/apollo/contact';

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
    marginTop: 32,
    marginBottom: 50,
  },
});

class NumberConfirmed extends Component {
  onNext = () => {
    const { onNext, syncContacts } = this.props;
    syncContacts();
    onNext();
  }

  render() {
    const { user } = this.props.auth;
    const { firstName } = user;
    return (
      <ScrollView>
        <View style={styles.paddedSection}>
          <StepsHeading>{trans('onboarding.your_number_is_confirmed')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.welcome_you_are_now_participating', { firstName })}
          </StepsTitle>
          <AppText style={styles.text}>
            {trans('onboarding.press_enter_to_start_looking_around_and_say_hi')}
          </AppText>
          <RoundedButton
            onPress={this.onNext}
            style={styles.button}
            bgColor={Colors.background.pink}
          >
            {trans('onboarding.enter')}
          </RoundedButton>
        </View>
      </ScrollView>
    );
  }
}

NumberConfirmed.propTypes = {
  onNext: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  syncContacts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(withContactSync, connect(mapStateToProps))(NumberConfirmed);
