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
import { userRegister } from '@services/apollo/auth';
import { NavigationActions } from 'react-navigation';
import { Loading, Wrapper } from '@components/common';
import { withContacts } from '@services/apollo/contact';
import Contacts from 'react-native-contacts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ddd',
    width: 300,
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
    marginTop: 10,
    marginBottom: 20,
  },
});


class Register extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.secureText = true;
    this.state = ({ firstName: '', lastName: '', email: '', phone: '', password: '', loading: false, error: '' });
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
    const { firstName, lastName, email, password, phone } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(firstName, lastName, email, password, phone).then(({ data }) => {
          const { token, User } = data.register;
          setLogin({ token, user: User }).then(() => {
            this.sync();
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
    navigation.navigate(routeName);
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  sync() {
    const { syncContacts } = this.props;
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.error(err);
      } else {
        const mobiles = [];
        contacts.forEach(
          contact => contact.phoneNumbers.forEach(book => mobiles.push(book.number)),
        );
        syncContacts(mobiles)
          .then(res => console.log(res))
          .catch(error => console.error(error));
      }
    });
  }

  checkValidation() {
    const errors = [];
    const { email, phone, password, firstName, lastName } = this.state;

    if (firstName === '') {
      errors.push('First Name is required.');
    }

    if (lastName === '') {
      errors.push('Last Name is required.');
    }

    if (email === '') {
      errors.push('Email is required.');
    }

    if (phone === '') {
      errors.push('Phone is required.');
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
      title="Register"
    />);
  }

  render() {
    const { error } = this.state;
    const { navigation } = this.props;
    return (
      <Wrapper>
        <View style={styles.container}>
          <Text style={styles.title} >Register</Text>
          {(error !== '') && (<View style={styles.inputWrapper}><Text>{error}</Text></View>)}

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={firstName => this.setState({ firstName })}
              style={styles.input}
              placeholder={'First Name'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={lastName => this.setState({ lastName })}
              style={styles.input}
              placeholder={'Last Name'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={email => this.setState({ email })}
              style={styles.input}
              keyboardType="email-address"
              placeholder={'Email'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={phone => this.setState({ phone })}
              style={styles.input}
              placeholder={'Phone'}
              keyboardType="phone-pad"
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
              secureTextEntry={this.secureText}
              placeholder="Password"
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <View style={styles.inputWrapper}>
          {this.renderButton()}
        </View>

        <Button
          onPress={() => {
            navigation.navigate('Login');
          }}
          title="Login"
        />
      </Wrapper>
    );
  }
}


Register.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  submit: PropTypes.func.isRequired,
  syncContacts: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setLogin: user => AuthService.set(user)
    .then(() => dispatch(AuthAction.login(user))),
});

export default compose(userRegister, withContacts,
  connect(mapStateToProps, mapDispatchToProps))(Register);
