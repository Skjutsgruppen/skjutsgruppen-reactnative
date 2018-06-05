import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { RoundedButton } from '@components/common';
import { AppText, Title, Heading } from '@components/utils/texts';
import Radio from '@components/add/radio';
import BackButton from '@components/onBoarding/backButton';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    lineHeight: 32,
    marginVertical: 16,
  },
  section: {
    marginVertical: 12,
  },
  text: {
    lineHeight: 30,
  },
  registerButtonWrapper: {
    paddingTop: 30,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.fullWhite,
    elevation: 20,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
  },
  button: {
    alignSelf: 'center',
    width: 200,
    marginTop: 28,
    marginBottom: 12,
  },
});

class Registration extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      registrationChecked: false,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  onRegistrationCheck = () => {
    const { registrationChecked } = this.state;

    this.setState({ registrationChecked: !registrationChecked });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.replace('Onboarding', { activeStep: 1 });
  }

  render() {
    const { registrationChecked } = this.state;
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.content}>
            <Heading size={32} color={Colors.text.pink} style={styles.header}>{trans('onboarding.we_are_participants')}</Heading>
            <Title size={24} color={Colors.text.gray} style={styles.title}>
              {trans('onboarding.all_of_us_are_the_movement')}
            </Title>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.this_can_be_lengthy')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText fontVariation="semibold" style={styles.text}>
                {trans('onboarding.this_information_is_stored_encrypted')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_phone_number')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_email_address')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.we_confirm_phone_numbers_to_increase_the_safety')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText fontVariation="semibold" style={styles.text}>
                {trans('onboarding.this_info_is_only_visible_in_the_app_for_other_participants')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_full_name')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_social_media_information')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.if_you_are_supporter_of_the_self_sustaining_garden')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.the_number_of_experiences_you_have')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_comments')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText fontVariation="semibold" style={styles.text}>
                {trans('onboarding.limitations_in_the_app')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.comments_you_make_in_closed_groups_are_only_seen')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText fontVariation="semibold" style={styles.text}>
                {trans('onboarding.this_information_can_be_seen_by_other_participants')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.your_first_name')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.photos_you_upload')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.rides_that_you_have_added_and_participated_in')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.groups_that_you_have_added_and_participated_in')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.experience_you_have_agreed_you_are_part_of')}
              </AppText>
              <AppText style={styles.text}>
                - {trans('onboarding.when_you_choose_to_show_you_live_location')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.the_information_you_provide_in_this_app_is_stored')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText fontVariation="semibold" style={styles.text}>
                {trans('onboarding.newsletter_and_or_text_message')}
              </AppText>
              <AppText style={styles.text}>
                {trans('onboarding.only_the_non_profit_association_that_acts_as_an')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.skjutsgruppen_ideel_forening')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.for_questions_to_the_association_email')}
              </AppText>
            </View>
            <View style={styles.section}>
              <AppText style={styles.text}>
                {trans('onboarding.by_clicking_i_agree_you_agree')}
              </AppText>
              <AppText
                onPress={() => Linking.openURL('https://web.skjutsgruppen.nu/privacy-policy')}
                style={[styles.text, { marginBottom: 100 }]}
                color={Colors.text.blue}
                fontVariation="bold"
              >
                {trans('onboarding.read_all_of_the_privacy_policy_here')}
              </AppText>
            </View>
          </View>
        </ScrollView>
        <View style={styles.registerButtonWrapper}>
          <Radio
            active={registrationChecked}
            label="I give the consent to registering my personal information."
            onPress={this.onRegistrationCheck}
          />
          <RoundedButton
            onPress={this.onNext}
            style={styles.button}
            bgColor={registrationChecked ? Colors.background.pink : Colors.background.lightGray}
            disabled={!registrationChecked}
          >
            {trans('global.next')}
          </RoundedButton>
          <BackButton onPress={this.goBack} />
        </View>
      </View>

    );
  }
}

Registration.propTypes = {
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Registration);
