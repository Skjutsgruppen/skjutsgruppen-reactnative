import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { userLogin } from '@services/apollo/auth';
import { withContactSync } from '@services/apollo/contact';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import { getToast } from '@config/toast';
import Toast from '@components/toast';

const styles = StyleSheet.create({
  garderIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 54,
    paddingHorizontal: 16,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 32,
  },
  userNameInput: {
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 24,
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

  componentWillMount() {
    const { auth, navigation } = this.props;

    if (auth.login) {
      navigation.replace('Tab');
    }
  }

  onSubmit = async () => {
    this.setState({ loading: true });
    const { submit, setLogin, setRegister, navigation, syncContacts } = this.props;
    const { username, password } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        const { data } = await submit(username, password);
        const { User, token } = data.login;
        if (!User.emailVerified) {
          setRegister({ token, user: User }).then(() => {
            navigation.replace('CheckMail');
          });
        } else if (!User.phoneVerified) {
          setRegister({ token, user: User }).then(() => {
            navigation.replace('SendText');
          });
        } else {
          setLogin({ token, user: User })
            .then(() => {
              navigation.replace('Tab');
              syncContacts();
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
      return <Loading />;
    }

    return (
      <CustomButton
        bgColor={Colors.background.green}
        onPress={this.onSubmit}
        style={styles.button}
      >
        Next
      </CustomButton>
    );
  }

  render() {
    const { error, inputs } = this.state;

    return (
      <Container>
        <Image source={require('@assets/icons/icon_garden.png')} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>Sign in</GreetText>
        <ColoredText color={Colors.text.purple}>
          You can use your cellphone number or e-mail to sign in
        </ColoredText>
        <Toast message={error} type="error" />
        <View style={styles.inputWrapper}>
          <TextInput
            autoCapitalize="none"
            onChangeText={username => this.setState({ username })}
            style={[styles.input, styles.userNameInput]}
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
        <BackButton onPress={this.onPressBack} />
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
  connect(mapStateToProps, mapDispatchToProps),
)(Login);
