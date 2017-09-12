import React, { Component } from 'react';
import {
  View, Text,
  StyleSheet,
  Button,
  TextInput,
  ToastAndroid as Toast,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { userLogin } from '@services/apollo/auth';
import { NavigationActions } from 'react-navigation';
import { Loading, Wrapper } from '@components/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#ddd',
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#222',
  },
  inputWrapper: {
    height: 70,
  },
  title: {
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
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
          const { token, User } = data.login;
          setLogin({ token, user: User }).then(() => {
            this.navigateTo('Tab');
          });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Toast.show(validation.errors.join('\n'), Toast.LONG);
      this.setState({ loading: false });
    }
  }

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

    return (<Button
      onPress={this.onSubmit}
      title="Login"
    />);
  }

  render() {
    const { error } = this.state;
    const { navigation } = this.props;

    return (
      <Wrapper>
        <Text style={styles.title} >Login</Text>
        {(error !== '') && (<View style={styles.inputWrapper}><Text>{error}</Text></View>)}

        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            style={styles.input}
            placeholder={'Email or Phone number'}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            value={this.state.password}
            secureTextEntry={this.secureText}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.inputWrapper}>
          {this.renderButton()}
        </View>

        <Button
          onPress={() => {
            navigation.navigate('Register');
          }}
          title="Register"
        />
      </Wrapper>
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
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setLogin: user => AuthService.set(user)
    .then(() => dispatch(AuthAction.login(user)))
    .catch(error => console.log(error)),
});

export default compose(userLogin, connect(mapStateToProps, mapDispatchToProps))(Login);
