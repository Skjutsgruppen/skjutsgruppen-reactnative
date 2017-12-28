import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import { Loading } from '@components/common';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withUpdateProfile } from '@services/apollo/auth';
import { Icons } from '@icons';
import Phone from '@components/phone';
import { getPhoneNumber } from '@services/device';
import { getToast } from '@config/toast';
import Toast from '@components/new/toast';

const styles = StyleSheet.create({
  garderIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 32,
  },
  countryCodeWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCode: {
    height: '100%',
    paddingHorizontal: 12,
  },
  input: {
    padding: 16,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 0,
  },
  firstInputWrapper: {
    marginBottom: 12,
  },
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
  buttonWrapper: {
    marginHorizontal: 24,
  },
});

class Verified extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ firstName: '', lastName: '', countryCode: '+977', phone: '', password: '', loading: false, error: '', inputs: {} });
  }

  componentWillMount() {
    const { auth, navigation } = this.props;
    if (auth.login) {
      navigation.reset('Tab');
    }

    this.setState({ firstName: auth.user.firstName || '', lastName: auth.user.lastName || '', phone: getPhoneNumber() });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { updateProfile, updateUser, navigation } = this.props;
    const { firstName, lastName, countryCode, phone, password } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        updateProfile({ firstName, lastName, phoneNumber: phone, phoneCountryCode: countryCode, password })
          .then(({ data }) => {
            const { token, User } = data.updateUser;
            updateUser({ token, user: User }).then(() => {
              navigation.reset('SendText');
            });
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

  focusNextField = (id) => {
    const { inputs } = this.state;

    inputs[id].focus();
  }

  checkValidation() {
    const errors = [];
    const { firstName, lastName, countryCode, phone, password } = this.state;

    if (firstName === '') {
      errors.push('FIRST_NAME_REQUIRED');
    }

    if (lastName === '') {
      errors.push('LAST_NAME_REQUIRED');
    }

    if (countryCode === '') {
      errors.push('COUNTRY_CODE_REQUIRED');
    }

    if (!phone || phone.length < 1) {
      errors.push('PHONE_REQUIRED');
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
        style={styles.buttonWrapper}
      >
        Next
      </CustomButton>
    );
  }

  render() {
    const message = 'Great job! \n Now fill in your name';
    const { error, inputs } = this.state;

    return (
      <Container>
        <Image source={Icons.Garden} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>Your e-mail is confirmed!</GreetText>
        <ColoredText color={Colors.text.purple}>{message}</ColoredText>
        <Toast message={error} type="error" />
        <View style={[styles.inputWrapper, styles.firstInputWrapper]}>
          <TextInput
            style={[styles.input, styles.firstNameInput]}
            placeholder="Your first name"
            underlineColorAndroid="transparent"
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
            autoCapitalize="words"
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
            style={[styles.input, styles.firstNameInput]}
            placeholder="Your last name"
            underlineColorAndroid="transparent"
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
            autoCapitalize="words"
            ref={(input) => { inputs.two = input; }}
          />
        </View>

        <View style={[styles.inputWrapper, styles.firstInputWrapper]}>
          <Phone
            defaultCode={this.state.countryCode}
            style={[styles.input, styles.firstNameInput]}
            placeholder="Your Mobile number"
            onChange={({ code, number }) => this.setState({ countryCode: code, phone: number })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({ password })}
            onSubmitEditing={this.onSubmit}
            returnKeyType="send"
          />
        </View>
        {this.renderButton()}
      </Container>
    );
  }
}

Verified.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(withUpdateProfile, connect(mapStateToProps, mapDispatchToProps))(Verified);
