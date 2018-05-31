import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Clipboard } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import { AppText, Title } from '@components/utils/texts';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Toast from '@components/toast';
import SendSMS from 'react-native-sms';
import { SMS_NUMBER } from '@config';
import { withPhoneVerified, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  text: {
    color: Colors.text.gray,
    lineHeight: 26,
    marginTop: 16,

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
});

class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, error: '', warning: '', success: '', user: {}, token: null, code: '' });
    this.interval = null;
  }

  async componentWillMount() {
    const { phoneVerificationCode, regeneratePhoneVerification } = this.props;
    const user = await AuthService.getUser();
    this.setState({ user }, this.setPolling);

    if (!phoneVerificationCode) {
      const verificationCode = await regeneratePhoneVerification(null, user.email);
      this.setState({ code: verificationCode.data.regeneratePhoneVerification });
    } else {
      this.setState({ code: phoneVerificationCode });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  onSubmitSendText = () => {
    const { code } = this.state;
    Clipboard.setString(code);

    SendSMS.send({
      body: code,
      recipients: [SMS_NUMBER],
      successTypes: ['sent', 'queued'],
    }, () => { });

    this.onNext();
  }

  setPolling() {
    const { isPhoneVerified, setLogin } = this.props;
    const { user } = this.state;
    this.interval = setInterval(() => {
      try {
        isPhoneVerified(user.id).then(({ data }) => {
          if (data.isPhoneVerified.User.phoneVerified) {
            setLogin({
              token: data.isPhoneVerified.token,
              user: data.isPhoneVerified.User,
            }).then(() => {
              // navigation.replace('MobileVerified');
              this.onNext();
            }).catch(console.warn);
          }
        }).catch(console.warn);
      } catch (err) {
        console.warn(err);
      }
    }, 10000);
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.navigate('Onboarding', { activeStep: 7 });
  }

  render() {
    const { error, warning, success, code } = this.state;

    return (
      <ScrollView>
        <View style={styles.paddedSection}>
          <Toast message={error} type="error" />
          <Toast message={warning} type="warning" />
          <Toast message={success} type="success" />
          <StepsHeading>{trans('onboarding.almost_done')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.need_to_do_is_confirm_cellphone_and_done')}
          </StepsTitle>
          <AppText style={styles.text}>
            {trans('onboarding.you_will_confirm_by_sending_a_text_message')}
          </AppText>
          <View style={styles.horizontalDivider} />
          <AppText color={Colors.text.blue}>{trans('onboarding.YOUR_UNIQUE_CODE')}</AppText>
          <Title
            size={24}
            color={Colors.text.gray}
            style={styles.code}
          >
            {code}
          </Title>
          <RoundedButton
            onPress={() => this.onSubmitSendText()}
            style={styles.button}
            bgColor={Colors.background.pink}
          >
            {trans('onboarding.send_text_message')}
          </RoundedButton>
        </View>
      </ScrollView>
    );
  }
}

SendMessage.propTypes = {
  isPhoneVerified: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  phoneVerificationCode: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
};

SendMessage.defaultProps = {
  phoneVerificationCode: '',
};

const mapStateToProps = state => ({ phoneVerificationCode: state.auth.user.verificationCode });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
  setPhoneVerificationCode: code => AuthService.setPhoneVerification(code)
    .then(() => dispatch(AuthAction.phoneVerification(code)))
    .catch(error => console.warn(error)),
});

export default compose(withPhoneVerified,
  withNavigation,
  withRegeneratePhoneVerification,
  connect(mapStateToProps, mapDispatchToProps))(SendMessage);
