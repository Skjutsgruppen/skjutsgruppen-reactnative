import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Clipboard } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { RoundedButton, Loading, ConfirmModal } from '@components/common';
import { AppText, Title } from '@components/utils/texts';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import SendSMS from 'react-native-sms';
import { SMS_NUMBER } from '@config';
import {
  withPhoneVerified,
  withRegeneratePhoneVerification,
  PHONE_VERIFICATION_SUBSCRIPTION,
  withRenewPhoneNumber,
} from '@services/apollo/auth';
import { withNavigation, NavigationActions } from 'react-navigation';
import client from '@services/apollo';
import { PHONE_EXISTS_ERROR, PHONE_INCORRECT_ERROR } from '@config/constant';
import { getDeviceId } from '@helpers/device';
import firebase from 'react-native-firebase';
import { LoginManager } from 'react-native-fbsdk';
import { resetLocalStorage } from '@services/apollo/dataSync';
import { withRemoveAppToken } from '@services/apollo/profile';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  text: {
    color: Colors.text.gray,
    lineHeight: 26,
    marginTop: 8,

  },
  horizontalDivider: {
    borderWidth: 0.3,
    borderColor: Colors.background.lightGray,
    width: 60,
    marginTop: 40,
    marginBottom: 24,
  },
  code: {
    marginTop: 30,
  },
  button: {
    width: 200,
    marginTop: 32,
    marginBottom: 50,
  },
  generatingCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
});

class UpdatePhonenumber extends Component {
  constructor(props) {
    super(props);
    this.state = (
      {
        loading: false,
        error: '',
        warning: '',
        success: '',
        user: {},
        token: null,
        code: '',
        timeout: false,
        confirmedUser: {},
        confirmBack: false,
        messageSent: false,
        newNumber: null,
      }
    );
    this.subscriber = null;
  }

  async componentWillMount() {
    const { phoneVerificationCode, regeneratePhoneVerification } = this.props;
    const user = await AuthService.getUser();
    this.setState({ user }, this.setPolling());

    if (!phoneVerificationCode) {
      const verificationCode = await regeneratePhoneVerification(null, user.email);
      this.setState({ code: verificationCode.data.regeneratePhoneVerification });
    } else {
      this.setState({ code: phoneVerificationCode });
    }
  }

  componentDidMount() {
    const { user } = this.props;
    const self = this;

    this.subscriber = client.subscribe({
      query: PHONE_VERIFICATION_SUBSCRIPTION,
      variables: { id: user.id },
    }).subscribe({
      next(data) {
        if (data.updatedAccount) {
          const { updatedAccount: { accountInfo, code, newNumber } } = data;
          self.setState({ error: code, updatedAccount: accountInfo, newNumber });
          clearInterval(self.interval);
        }
        if (data.verification && data.verification.accountInfo) {
          const { verification: { accountInfo, code, newNumber } } = data;
          self.setState({ error: code, confirmedUser: accountInfo, newNumber });
          clearInterval(self.interval);
        }
      },
      error(err) {
        console.warn(err);
      },
    });
  }

  componentWillUnmount() {
    this.subscriber.unsubscribe();
    clearInterval(this.interval);
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  onSubmitSendText = () => {
    const { code } = this.state;
    Clipboard.setString(code);

    this.setState({ loading: true, messageSent: true });

    setTimeout(() => {
      this.setState({ loading: false, timeout: true });
    }, 60000 * 30);

    SendSMS.send({
      body: code,
      recipients: [SMS_NUMBER],
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  setPolling() {
    const { isPhoneVerified, setLogin, isOnboarding } = this.props;
    const { user } = this.state;
    this.interval = setInterval(() => {
      try {
        isPhoneVerified(user.id).then(({ data }) => {
          const updatedUser = data.isPhoneVerified.User;
          if (this.state.messageSent && updatedUser.verificationErrorInfo) {
            const { code, accountInfo, newNumber } = updatedUser.verificationErrorInfo;
            this.setState({ error: code || '', confirmedUser: accountInfo, newNumber }, () => clearInterval(this.interval));
          }

          if (data.isPhoneVerified.User.phoneVerified) {
            setLogin({
              token: data.isPhoneVerified.token,
              user: updatedUser,
            }).then(() => {
              if (isOnboarding) {
                this.onNext();
              }
            }).catch(console.warn);
          }
        }).catch(console.warn);
      } catch (err) {
        console.warn(err);
      }
    }, 10000);
  }

  getButtonText = () => {
    const { timeout } = this.state;

    return (timeout) ? trans('onboarding.resend_text_message') : trans('onboarding.send_text_message');
  }

  updateUser = () => {
    const { renewPhoneNumber, setLogin } = this.props;
    const { newNumber } = this.state;

    renewPhoneNumber(newNumber).then(({ data }) => {
      const { token, User: updatedUser } = data.renewPhoneNumber;
      if (token && updatedUser) {
        setLogin({
          token,
          user: updatedUser,
        })
      }
      clearInterval(this.interval);
      this.setState({ error: '' }, this.onNext());
    });
  }


  logout = (screen = 'Splash') => {
    const { logout, removeAppToken } = this.props;
    this.setState({ loading: true }, async () => {
      await removeAppToken(getDeviceId());
      await firebase.notifications().cancelAllNotifications();
      logout()
        .then(() => LoginManager.logOut())
        .then(() => this.reset(screen))
        .catch(() => this.reset(screen));
    });
  }

  reset = async (screen) => {
    const { navigation } = this.props;
    await resetLocalStorage();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen })],
    });
    navigation.dispatch(resetAction);
  }

  renderConfirmModal = () => {
    const { confirmBack } = this.state;

    return (
      <ConfirmModal
        loading={false}
        visible={confirmBack}
        onRequestClose={() => this.setState({ confirmBack: false })}
        message={trans('onboarding.will_reset_your_session')}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={() => this.logout()}
        onDeny={() => this.setState({ confirmBack: false })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderUpdatePhoneModal = () => {
    const { error } = this.state;

    return (
      <ConfirmModal
        loading={false}
        visible={error === PHONE_INCORRECT_ERROR}
        onRequestClose={() => this.setState({ error: '' })}
        message={trans('onboarding.new_number')}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={() => this.updateUser()}
        onDeny={() => this.setState({ error: '' })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderSendMessageScreen = () => {
    const { code, loading } = this.state;
    const { isOnboarding } = this.props;

    return (
      <View style={styles.paddedSection}>
        <StepsHeading>{isOnboarding ? trans('onboarding.almost_done') : trans('profile.change_phone_number')}</StepsHeading>
        <StepsTitle>
          {trans('onboarding.need_to_do_is_confirm_cellphone_and_done')}
        </StepsTitle>
        <AppText style={styles.text}>
          {trans('onboarding.you_will_confirm_by_sending_a_text_message')}
          <AppText style={{ color: Colors.text.blue }}>
            {` ${SMS_NUMBER}`}
          </AppText>
          {`. ${trans('onboarding.the_text_message_costs')}`}
        </AppText>
        <View style={styles.horizontalDivider} />
        <AppText color={Colors.text.blue}>{trans('onboarding.YOUR_UNIQUE_CODE')}</AppText>
        {
          (code !== '' && code) ?
            <Title
              size={24}
              color={Colors.text.gray}
              style={styles.code}
            >
              {code}
            </Title> :
            <View style={styles.generatingCode}>
              <Loading />
              <AppText color={Colors.text.lightGray} style={{ marginLeft: 12 }}>
                {trans('onboarding.generating_code')}
              </AppText>
            </View>
        }
        {loading ? <Loading style={{ marginVertical: 12 }} /> : <RoundedButton
          onPress={() => this.onSubmitSendText()}
          style={styles.button}
          bgColor={Colors.background.pink}
        >
          {this.getButtonText()}
        </RoundedButton>
        }
        {
          isOnboarding &&
          <AppText style={styles.text} onPress={() => this.setState({ confirmBack: true })}>
            {trans('onboarding.back')}
          </AppText>
        }
      </View >
    );
  }

  renderNumberConfirmedScreen = () => {
    const { isOnboarding } = this.props;
    const { confirmedUser } = this.state;
    const { firstName, lastName, email } = confirmedUser;

    return (
      <View style={styles.paddedSection}>
        <StepsHeading>{trans('onboarding.number_already_confirmed')}</StepsHeading>
        <StepsTitle>
          {trans('onboarding.number_already_confirmed_description', { firstName, lastName, email })}
        </StepsTitle>
        {
          isOnboarding &&
          <View>
            <AppText style={styles.text}>
              {trans('onboarding.go_to_log_in')}
            </AppText>
            <RoundedButton
              onPress={() => this.logout('LoginMethod')}
              style={styles.button}
              bgColor={Colors.background.pink}
            >
              {trans('onboarding.login')}
            </RoundedButton>
            <AppText style={styles.text} onPress={() => this.logout()}>
              {trans('onboarding.start_over')}
            </AppText>
          </View>
        }
      </View>
    );
  }

  renderScreen = () => {
    const { error, confirmedUser } = this.state;

    if (error === PHONE_EXISTS_ERROR && confirmedUser && Object.keys(confirmedUser).length > 0) {
      return this.renderNumberConfirmedScreen();
    }

    return this.renderSendMessageScreen();
  }

  render() {
    const { isOnboarding } = this.props;
    const { user } = this.state;

    if (Object.keys(user).length < 1) {
      return null;
    }

    return (
      <ScrollView>
        {this.renderScreen()}
        {isOnboarding && this.renderConfirmModal()}
        {this.renderUpdatePhoneModal()}
      </ScrollView>
    );
  }
}

UpdatePhonenumber.propTypes = {
  isPhoneVerified: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  phoneVerificationCode: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  removeAppToken: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  renewPhoneNumber: PropTypes.func.isRequired,
  isOnboarding: PropTypes.bool,
};

UpdatePhonenumber.defaultProps = {
  phoneVerificationCode: '',
  isOnboarding: true,
};

const mapStateToProps = state => (
  { phoneVerificationCode: state.auth.user.verificationCodem, user: state.auth.user }
);
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
  setPhoneVerificationCode: code => AuthService.setPhoneVerification(code)
    .then(() => dispatch(AuthAction.phoneVerification(code)))
    .catch(error => console.warn(error)),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(withPhoneVerified,
  withNavigation,
  withRegeneratePhoneVerification,
  withRemoveAppToken,
  withRenewPhoneNumber,
  connect(mapStateToProps, mapDispatchToProps))(UpdatePhonenumber);
