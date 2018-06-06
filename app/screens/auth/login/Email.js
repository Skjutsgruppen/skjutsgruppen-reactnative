import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { userLogin, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { withContactSync } from '@services/apollo/contact';
import { Loading, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { NavigationActions, withNavigation } from 'react-navigation';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import Phone from '@components/phone';
import { trans } from '@lang/i18n';
import BackButton from '@components/onBoarding/backButton';
import { AppText } from '@components/utils/texts';
import PasswordInput from '@components/common/passwordInput';

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
  },
  input: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 80,
    marginTop: 30,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.mutedBlue,
  },
  button: {
    width: 200,
    marginVertical: 50,
  },
  paddedSection: {
    paddingHorizontal: 30,
  },
  bottomPadding: {
    paddingBottom: 30,
  },
  or: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  forgotPassword: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },
});

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.secureText = true;
    this.state = ({ username: '', password: '', loading: false, error: '', inputs: {}, number: '', email: '' });
  }

  async componentWillMount() {
    const { auth, navigation } = this.props;

    if (auth.login) {
      navigation.replace('Tab');
    }
  }

  onSubmit = async () => {
    this.setState({ loading: true });
    const {
      submit,
      setLogin,
      setRegister,
      navigation,
      syncContacts,
      storeAppToken,
      regeneratePhoneVerification,
    } = this.props;
    const { username, password } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        const { data } = await submit(username, password);
        const { User, token } = data.login;
        await setLogin({ token, user: User });

        if (!User.agreementRead) {
          navigation.replace('Agreement');
        } else if (!User.agreementAccepted) {
          navigation.replace('Registration');
        } else if (!User.emailVerified) {
          setRegister({ token, user: User }).then(() => {
            navigation.replace('Onboarding', { activeStep: 5 });
          });
        } else if (!User.firstName || !User.lastName) {
          navigation.replace('Onboarding', { activeStep: 6 });
        } else if (!User.phoneVerified) {
          setRegister({ token, user: User }).then(async () => {
            if (!User.verificationCode) {
              const code = await regeneratePhoneVerification(null, User.email);
              User.verificationCode = code.data.regeneratePhoneVerification;
            }
            navigation.replace('Onboarding', { activeStep: 8 });
          });
        } else {
          setLogin({ token, user: User })
            .then(async () => {
              await firebase.messaging().getToken()
                .then(appToken => storeAppToken(appToken, getDeviceId()));

              if (!User.agreementRead) {
                navigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: 'Agreement',
                      }),
                    ],
                  }),
                );
              } else if (!User.agreementAccepted) {
                navigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: 'Registration',
                      }),
                    ],
                  }),
                );
              } else {
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
            })
            .catch(err => console.warn(err));
        }
      } catch (err) {
        this.setState({ loading: false, error: getToast(err) });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors) });
    }
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  }

  onPhoneNumberChange = (code, number) => {
    this.setState({ email: '', number, username: `${code}${parseInt(number, 0)}` });
  }

  onEmailChange = (email) => {
    this.setState({ email, number: '', username: email });
  }

  focusNextField = (id) => {
    const { inputs } = this.state;
    inputs[id].focus();
  }

  checkValidation() {
    const errors = [];
    const { username, password } = this.state;

    if (username === '') {
      errors.push('USERNAME_REQUIRED');
    }

    if (password === '') {
      errors.push('PASSWORD_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return <Loading style={{ marginVertical: 24 }} />;
    }

    return (
      <View style={styles.paddedSection}>
        <RoundedButton
          onPress={this.onSubmit}
          style={styles.button}
          bgColor={Colors.background.pink}
        >
          {trans('onboarding.login')}
        </RoundedButton>
      </View>
    );
  }

  render() {
    const { error, inputs } = this.state;
    const { navigation } = this.props;

    return (
      <Container>
        <StepsHeading style={styles.paddedSection}>{trans('onboarding.login')}</StepsHeading>
        <StepsTitle style={styles.paddedSection}>
          {trans('onboarding.you_can_use_your_cellphone_number_or_email_to_sign_in')}
        </StepsTitle>
        <Toast message={error} type="error" />
        <View style={{ marginTop: 32 }} />
        <Phone
          defaultCode="+977"
          placeholder={trans('profile.your_mobile_number')}
          onChange={({ code, number }) => this.onPhoneNumberChange(code, number)}
          value={this.state.number}
          autoFocus
        />
        <AppText color={Colors.text.blue} style={styles.or}>{trans('onboarding.or')}</AppText>
        <View style={styles.inputWrapper}>
          <TextInput
            autoCapitalize="none"
            onChangeText={username => this.onEmailChange(username)}
            style={styles.input}
            placeholder={trans('onboarding.your_email')}
            underlineColorAndroid="transparent"
            keyboardType="email-address"
            value={this.state.email}
            // onSubmitEditing={() => {
            //   this.focusNextField('two');
            // }}
            ref={(input) => { inputs.one = input; }}
            // returnKeyType="next"
          />
        </View>
        <PasswordInput
          placeholder={trans('onboarding.your_password')}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          onSubmitEditing={this.onSubmit}
          ref={(input) => { inputs.two = input; }}
          returnKeyType="send"
        />
        <AppText
          color={Colors.text.blue}
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
          fontVariation="semibold"
        >
          {trans('onboarding.forgot_password')}
        </AppText>
        {this.renderButton()}
        <View style={styles.paddedSection}>
          <BackButton leftAligned onPress={this.onPressBack} />
        </View>
      </Container>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  submit: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  setRegister: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    reset: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  storeAppToken: PropTypes.func.isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token }))),
});

export default compose(
  userLogin,
  withContactSync,
  withStoreAppToken,
  withRegeneratePhoneVerification,
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps),
)(Login);
