import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppText } from '@components/utils/texts';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { RoundedButton, Loading } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import BackButton from '@components/onBoarding/backButton';
import Input from '@components/onBoarding/input';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { withVerifyEmail, withResendEmailVerification } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  button: {
    width: 200,
    marginTop: 50,
    marginBottom: 24,
  },
  text: {
    paddingVertical: 20,
    color: Colors.text.gray,
    lineHeight: 26,
  },
  resendVerification: {
    paddingVertical: 24,
    color: Colors.text.blue,
  },
});

class CheckEmail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ verificationCode: '', loading: false, resendVerificationLoading: false, error: '', success: '' });
  }

  componentWillMount() {
    const { auth, navigation } = this.props;
    if (auth.login) {
      navigation.replace('Tab');
    }
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { verifyEmail, setUser, auth, navigation } = this.props;
    const { verificationCode } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        verifyEmail(auth.user.email, verificationCode).then(({ data }) => {
          const { code } = data.verifyEmail;
          const user = auth.user;
          user.emailVerified = true;
          if (code === 'EMAIL_VERIFICATION_SUCCESS') {
            setUser(user).then(() => {
              this.setState({ loading: false, error: '' }, () => {
                if (user.phoneNumber && !user.phoneVerified) {
                  navigation.replace('Onboarding', { activeStep: 8 });
                } else {
                  this.onNext();
                }
              });
            });
          }
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
      } catch (err) {
        this.setState({ loading: false, error: getToast(err) });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors) });
    }
  }

  checkValidation() {
    const errors = [];
    const { verificationCode } = this.state;

    if (verificationCode === '') {
      errors.push('EMAIL_VERIFICATION_CODE_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }


  resendVerificationCode = () => {
    this.setState({ resendVerificationLoading: true });
    const { resendEmailVerification, auth } = this.props;

    try {
      resendEmailVerification(auth.user.email).then(() => {
        this.setState({ resendVerificationLoading: false, success: getToast(['EMAIL_VERIFICATION_CODE_RESENT']) });
      });
    } catch (err) {
      this.setState({ resendVerificationLoading: false, error: getToast(['ERROR_RESENDING_EMAIL_VERIFICATION']) });
    }
  }

  isValidated = () => {
    const { verificationCode } = this.state;
    return !(verificationCode === '');
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderButton = () => {
    const { loading } = this.state;
    if (loading) {
      return (<Loading style={{ marginVertical: 24 }} />);
    }

    return (
      <RoundedButton
        onPress={this.onSubmit}
        style={styles.button}
        bgColor={this.isValidated() ? Colors.background.pink : Colors.background.lightGray}
        disabled={!this.isValidated()}
      >
        {trans('global.next')}
      </RoundedButton>
    );
  }

  renderResendVerification = () => {
    const { resendVerificationLoading } = this.state;

    if (resendVerificationLoading) {
      return <Loading />;
    }

    return (
      <AppText
        style={styles.resendVerification}
        onPress={this.resendVerificationCode}
      >Resend Verification Code</AppText>
    );
  }

  render() {
    const { error } = this.state;
    return (
      <ScrollView>
        <View style={styles.paddedSection}>
          <StepsHeading>{trans('onboarding.check_email')}</StepsHeading>
          <Toast message={error} type="error" />
          <StepsTitle>
            {trans('onboarding.go_to_your_email_and_enter_the_confirmation_code', { email: this.props.auth.user.email })}
          </StepsTitle>
        </View>
        <Input
          onChangeText={verificationCode => this.setState({ verificationCode })}
          placeholder={trans('onboarding.please_enter_confirmation_code')}
          returnKeyType="send"
          onSubmitEditing={this.onSubmit}
          autoCapitalize="none"
        />
        <View style={styles.paddedSection}>
          {this.renderButton()}
          {this.renderResendVerification()}
          <AppText style={styles.text}>
            {trans('onboarding.you_cannot_proceed_without_confirming_your_email')}
          </AppText>
          <BackButton onPress={this.goBack} leftAligned />
        </View>
      </ScrollView>
    );
  }
}

CheckEmail.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user))),
});

export default compose(withNavigation,
  withVerifyEmail,
  withResendEmailVerification,
  connect(mapStateToProps, mapDispatchToProps))(CheckEmail);
