import React, { Component } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import { Loading, Input, CustomButton } from '@components/common';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withVerifyEmail, withResendEmailVerification } from '@services/apollo/auth';
import { Icons } from '@assets/icons';
import { getToast } from '@config/toast';
import Toast from '@components/toast';

const styles = StyleSheet.create({
  envelopIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
  grayText: {
    alignSelf: 'center',
    opacity: 0.7,
    lineHeight: 20,
    textAlign: 'center',
    width: '70%',
    marginBottom: 12,
  },
  button: {
    marginHorizontal: 24,
  },
  resendVerification: {
    color: Colors.text.blue,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

class Check extends Component {
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

  onSubmit = () => {
    this.setState({ loading: true });
    const { verifyEmail, navigation, setUser, auth } = this.props;
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
                  navigation.replace('SendText');
                } else {
                  navigation.replace('EmailVerified');
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

  reset = () => {
    const { logout, navigation } = this.props;

    logout().then(() => navigation.replace('Splash'));
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={this.onSubmit}
      >
        Next
      </CustomButton>
    );
  }

  renderResendVerification = () => {
    const { resendVerificationLoading } = this.state;

    if (resendVerificationLoading) {
      return <Loading />;
    }

    return (
      <Text
        style={styles.resendVerification}
        onPress={this.resendVerificationCode}
      >Resend Verification Code</Text>
    );
  }

  render() {
    const { error, success } = this.state;

    return (
      <Container>
        <Image source={Icons.EnvelopOpen} style={styles.envelopIcon} resizeMethod="resize" />
        <GreetText>Check your e-mail</GreetText>
        <ColoredText color={Colors.text.purple}>
          <Text>Go to your e-mail</Text>
          <Text style={{ color: '#663c6d' }}> {`'${this.props.auth.user.email}'`} </Text>
          <Text>and enter confirmation code below</Text>
        </ColoredText>
        <Toast message={success} type="success" />
        <Toast message={error} type="error" />
        <Input
          onChangeText={verificationCode => this.setState({ verificationCode })}
          placeholder="Verification code"
          returnKeyType="send"
          onSubmitEditing={this.onSubmit}
          autoCapitalize="none"
        />
        {this.renderButton()}
        {this.renderResendVerification()}
        <Text style={styles.grayText}>You can not proceed without confirming your e-mail</Text>
        <BackButton onPress={this.reset} />
      </Container>
    );
  }
}

Check.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user))),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(
  withVerifyEmail,
  withResendEmailVerification,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ))(Check);

