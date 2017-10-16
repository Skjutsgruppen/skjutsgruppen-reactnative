import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, ToastAndroid as Toast } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import { Loading } from '@components/common';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withVerifyCode } from '@services/apollo/auth';

const styles = StyleSheet.create({
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 32,
  },
  grayText: {
    opacity: 0.7,
    lineHeight: 20,
    textAlign: 'center',
    width: '70%',
    marginBottom: 12,
  },
});

class Check extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ code: '', loading: false, error: '' });
  }

  componentWillMount() {
    const { auth } = this.props;
    if (auth.login) {
      this.navigateTo('Tab');
    }
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { verifyCode, navigation, setUser, auth } = this.props;
    const { code } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        verifyCode(code).then(({ data }) => {
          const { status, message } = data.verifyCode;
          const user = auth.user;
          user.emailVerified = true;
          if (status) {
            setUser(user).then(() => {
              this.setState({ loading: false }, () => {
                navigation.navigate('EmailVerified');
              });
            });
          } else {
            this.setState({ loading: false, error: message });
          }
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

  checkValidation() {
    const errors = [];
    const { code } = this.state;

    if (code === '') {
      errors.push('Verification code is required.');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  reset = () => {
    const { logout } = this.props;

    logout().then(() => {
      this.props.navigation.navigate('Splash');
    });
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
      >
        Next
      </CustomButton>
    );
  }

  render() {
    const { error } = this.state;
    const message = `Go to your e-mail ${this.props.auth.user.email} and enter confirmation code below`;
    return (
      <Container>
        <GreetText>Check your e-mail</GreetText>
        <ColoredText color={Colors.text.purple}>
          {message}
        </ColoredText>

        {(error !== '') ? (<View><Text>{error}</Text></View>) : null}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={code => this.setState({ code })}
            placeholder="Verification code"
            underlineColorAndroid="transparent"
          />
        </View>
        {this.renderButton()}
        <Text style={styles.grayText}>You can not proceed without confirming your e-mail</Text>
        <BackButton onPress={this.reset} />
      </Container>
    );
  }
}

Check.propTypes = {
  verifyCode: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
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
    .catch(error => console.error(error)),
});

export default compose(withVerifyCode, connect(mapStateToProps, mapDispatchToProps))(Check);

