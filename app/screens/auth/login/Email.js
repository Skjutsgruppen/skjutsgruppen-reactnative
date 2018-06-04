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
import { NavigationActions } from 'react-navigation';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import { trans } from '@lang/i18n';
import BackButton from '@components/onBoarding/backButton';

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
});

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.secureText = true;
    this.state = ({ username: '', password: '', loading: false, error: '', inputs: {} });
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
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }
  render() {
    const { error, inputs } = this.state;

    return (
      <Container style={{ backgroundColor: Colors.background.fullWhite }}>
        <StepsHeading style={styles.paddedSection}>Sign in</StepsHeading>
        <StepsTitle style={styles.paddedSection}>
          You can use your cellphone number or e-mail to sign in
        </StepsTitle>
        <Toast message={error} type="error" />
        <View style={styles.inputWrapper}>
          <TextInput
            autoCapitalize="none"
            onChangeText={username => this.setState({ username })}
            style={styles.input}
            placeholder="Your cellphone number or e-mail"
            underlineColorAndroid="transparent"
            value={this.state.username}
            keyboardType="email-address"
            autoFocus
            onSubmitEditing={() => {
              this.focusNextField('two');
            }}
            ref={(input) => { inputs.one = input; }}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            secureTextEntry
            placeholder="Your Password"
            underlineColorAndroid="transparent"
            value={this.state.password}
            returnKeyType="send"
            onSubmitEditing={this.onSubmit}
            ref={(input) => { inputs.two = input; }}
          />
        </View>
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
  connect(mapStateToProps, mapDispatchToProps),
)(Login);
