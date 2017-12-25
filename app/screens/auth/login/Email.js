import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { userLogin } from '@services/apollo/auth';
import { NavigationActions } from 'react-navigation';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';

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
    this.state = ({ username: '', password: '', loading: false, error: '' });
  }

  componentWillMount() {
    const { auth } = this.props;
    if (auth.login) {
      this.navigateTo('Tab');
    }
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, setLogin } = this.props;
    const { username, password } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(username, password).then(({ data }) => {
          const { User, token } = data.login;
          setLogin({ token, user: User }).then(() => {
            if (!User.phoneVerified) {
              this.navigateTo('SendText');
            } else {
              this.navigateTo('Tab');
            }
          });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Alert.alert('Error!', validation.errors.join('\n'));
      this.setState({ loading: false });
    }
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  navigateTo = (routeName) => {
    const { navigation } = this.props;

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  checkValidation() {
    const errors = [];
    const { username, password } = this.state;

    if (username === '') {
      errors.push('Username is required.');
    }

    if (password === '') {
      errors.push('Password is required.');
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
    const { error } = this.state;

    return (
      <Container>
        <Image source={require('@icons/icon_garden.png')} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>Sign in</GreetText>

        <ColoredText color={Colors.text.purple}>
          You can use your cellphone number or e-mail to sign in
        </ColoredText>

        {(error !== '') ? (<View style={styles.inputWrapper}><Text>{error}</Text></View>) : null}

        <View style={styles.inputWrapper}>
          <TextInput
            autoCapitalize="none"
            onChangeText={username => this.setState({ username })}
            style={[styles.input, styles.userNameInput]}
            placeholder="Your cellphone number or e-mail"
            underlineColorAndroid="transparent"
            value={this.state.username}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
});

export default compose(userLogin, connect(mapStateToProps, mapDispatchToProps))(Login);
