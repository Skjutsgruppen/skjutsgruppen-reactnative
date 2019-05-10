import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { RoundedButton, Loading } from '@components/common';
import { AppText, Title, Heading } from '@components/utils/texts';
import Radio from '@components/add/radio';
import { withUpdateProfile, userRegister, withRegeneratePhoneVerification } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { getToast } from '@config/toast';
import { getDeviceId } from '@helpers/device';
import { withSocialConnect } from '@services/apollo/social';
import { withContactSync } from '@services/apollo/contact';
import { withStoreAppToken } from '@services/apollo/profile';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
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
      agreementAccepted: false,
    };
  }

  onSubmit = async () => {
    this.setState({ loading: true });
    const {
      updateProfile,
      updateUser,
      navigation,
    } = this.props;

    const { agreementAccepted } = this.state;

    if (navigation.state.params) {
      if (navigation.state.params.skipUpdateProfile) {
        this.setState({ loading: false });

        if (navigation.state.params.connectToFacebook || navigation.state.params.connectToTwitter) {
          await this.connectSocial(navigation.state.params.user);

          return;
        }

        await this.register(navigation.state.params.user);

        navigation.replace('Onboarding');

        return;
      }
    }

    try {
      updateProfile({
        agreementAccepted,
      })
        .then(({ data }) => {
          const { token, User } = data.updateUser;
          updateUser({ token, user: User }).then(() => {
            if (!User.phoneVerified) {
              navigation.replace('Onboarding', { activeStep: 8 });
            } else {
              navigation.replace('Tab');
            }
          });
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
    } catch (err) {
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  onRegistrationCheck = () => {
    const { agreementAccepted } = this.state;

    this.setState({ agreementAccepted: !agreementAccepted });
  }

  connectSocial = async ({ profile, auth: { accessToken, authToken, authTokenSecret } }) => {
    const {
      socialConnect,
      setLogin,
      navigation,
      syncContacts,
      storeAppToken,
      regeneratePhoneVerification,
    } = this.props;

    let response = {};

    if (navigation.state.params.connectToFacebook) {
      response = await socialConnect({
        id: profile.id,
        email: profile.email,
        token: accessToken,
        type: 'facebook',
      });
    } else if (navigation.state.params.connectToTwitter) {
      response = await socialConnect({
        id: profile.id_str,
        email: profile.email,
        token: authToken,
        secret: authTokenSecret,
        type: 'twitter',
        username: profile.screen_name,
      });
    }

    const { User, token } = response.data.connect;

    if (!User.phoneNumber) {
      const code = await regeneratePhoneVerification(null, User.email);
      User.verificationCode = code.data.regeneratePhoneVerification;
      await setLogin({ user: User });

      navigation.replace('Onboarding', { activeStep: 8 });

      return;
    }

    if (!User.phoneVerified) {
      navigation.replace('Onboarding', { activeStep: 8 });

      return;
    }

    await setLogin({
      token,
      user: User,
    });

    firebase.messaging().getToken()
      .then(appToken => storeAppToken(appToken, getDeviceId()));

    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Tab',
          }),
        ],
      }),
    );

    syncContacts();
  }

  register = async ({
    profile,
    auth: { accessToken: fbToken, authToken: twitterToken, authTokenSecret: twitterSecret },
  }) => {
    if (profile.email === '') {
      Alert.alert('Error!', 'Email is required');
      return;
    }
    const { register, setRegister, navigation, updateProfile } = this.props;


    try {
      const data = await register({
        email: profile.email,
        verified: true,
      });

      const { token, User } = data.data.register;
      await setRegister({ token, user: User });

      let response = {};
      let firstName = '';
      let lastName = '';

      if (fbToken) {
        firstName = profile.first_name;
        lastName = profile.last_name;

        response = await updateProfile({
          fbId: profile.id,
          fbToken,
          agreementRead: true,
          agreementAccepted: true,
        });
      } else {
        const twitterNameArray = profile.name.split(' ');
        firstName = '';
        lastName = '';
        if (twitterNameArray.length > 1) {
          firstName = twitterNameArray.slice(0, twitterNameArray.length - 1);
          firstName = firstName.join(' ');
          lastName = twitterNameArray[twitterNameArray.length - 1];
        } else {
          lastName = twitterNameArray[twitterNameArray.length - 1];
        }

        response = await updateProfile({
          twitterId: profile.id_str,
          twitterToken,
          twitterSecret,
          agreementRead: true,
          agreementAccepted: true,
          twitterUsername: profile.screen_name,
        });
      }

      await setRegister({
        token: response.data.updateUser.token,
        user: { ...response.data.updateUser.User, ...{ firstName, lastName } },
      }, true);

      navigation.replace('Onboarding', { activeStep: 6 });
    } catch (error) {
      console.warn(error);
    }
  }

  renderButton = () => {
    const { loading, agreementAccepted } = this.state;
    if (loading) {
      return (<Loading style={{ marginVertical: 24 }} />);
    }

    return (
      <RoundedButton
        onPress={this.onSubmit}
        style={styles.button}
        bgColor={agreementAccepted ? Colors.background.pink : Colors.background.lightGray}
        disabled={!agreementAccepted}
      >
        {trans('global.next')}
      </RoundedButton>
    );
  }

  render() {
    const { agreementAccepted } = this.state;

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
            active={agreementAccepted}
            label={trans("onboarding.i_give_consent")}
            onPress={this.onRegistrationCheck}
          />
          {this.renderButton()}
        </View>
      </View>

    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setRegister: async ({ user, token }, reduxOnly = false) => {
    await dispatch(AuthAction.register({ user, token }));
    if (!reduxOnly) {
      await AuthService.setAuth({ user, token });
    }
  },
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
});

Registration.propTypes = {
  updateUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  register: PropTypes.func,
  socialConnect: PropTypes.func,
  setLogin: PropTypes.func.isRequired,
};

Registration.defaultProps = {
  signup: false,
  user: {},
  register: null,
  socialConnect: null,

};

export default compose(
  userRegister,
  withNavigation,
  withUpdateProfile,
  withSocialConnect,
  withContactSync,
  withStoreAppToken,
  withRegeneratePhoneVerification,
  connect(mapStateToProps, mapDispatchToProps))(Registration);
