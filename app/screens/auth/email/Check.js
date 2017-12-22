import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, Alert } from 'react-native';
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
import { withVerifyCode } from '@services/apollo/auth';
import { Icons } from '@icons';

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
      Alert.alert('Error!', validation.errors.join('\n'));
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
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={this.onSubmit}
      >
        Next
      </CustomButton>
    );
  }

  render() {
    const { error } = this.state;
    return (
      <Container>
        <Image source={Icons.EnvelopOpen} style={styles.envelopIcon} resizeMethod="resize" />
        <GreetText>Check your e-mail</GreetText>
        <ColoredText color={Colors.text.purple}>
          <Text>Go to your e-mail</Text>
          <Text style={{ color: '#663c6d' }}> {`'${this.props.auth.user.email}'`} </Text>
          <Text>and enter confirmation code below</Text>
        </ColoredText>

        {(error !== '') ? (<View><Text>{error}</Text></View>) : null}
        <Input
          onChangeText={code => this.setState({ code })}
          placeholder="Verification code"
        />
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
    .catch(error => console.warn(error)),
});

export default compose(withVerifyCode, connect(mapStateToProps, mapDispatchToProps))(Check);

