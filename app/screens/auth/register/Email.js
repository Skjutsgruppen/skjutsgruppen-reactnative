import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import PropTypes from 'prop-types';
import { Loading, Input, CustomButton } from '@components/common';
import { userRegister } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import FBLogin from '@components/facebook/login';
import { getToast } from '@config/toast';
import Toast from '@components/new/toast';

const styles = StyleSheet.create({
  garderIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  divider: {
    alignSelf: 'center',
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
  button: {
    marginHorizontal: 24,
  },
});

class Email extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ email: '', loading: false, error: '' });
  }

  componentWillMount() {
    const { auth, navigation } = this.props;
    if (auth.login) {
      navigation.reset('Tab');
    }
  }

  onPressBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onSubmit = () => {
    this.setState({ loading: true });
    const { register, setRegister, navigation } = this.props;
    const { email } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        register({ email }).then(({ data }) => {
          const { token, User } = data.register;
          setRegister({ token, user: User }).then(() => {
            this.setState({ loading: false, error: '' }, () => {
              navigation.navigate('CheckMail');
            });
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

  checkValidation() {
    const errors = [];
    const { email } = this.state;

    if (email === '') {
      errors.push('EMAIL_REQUIRED');
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
        <Image source={require('@icons/icon_garden.png')} style={styles.garderIcon} />
        <GreetText>Become a participant</GreetText>
        <ColoredText color={Colors.text.purple}>Confirm your e-mail</ColoredText>
        <Toast message={error} type="error" />
        <Input
          defaultValue={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Fill in your e-mail"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={this.onSubmit}
        />
        {this.renderButton()}
        <View style={styles.divider} />
        <ColoredText color={Colors.text.purple}>
          Or sign up with Facebook or Twitter instead
        </ColoredText>

        <View style={styles.button}>
          <FBLogin signup navigation={this.props.navigation} />
        </View>

        <CustomButton
          style={styles.button}
          onPress={() => { }}
          bgColor="#1da1f2"
        >
          Sign up with Twitter
        </CustomButton>
        <BackButton onPress={this.onPressBack} />
      </Container>
    );
  }
}


Email.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  setRegister: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token }))),
});

export default compose(userRegister, connect(mapStateToProps, mapDispatchToProps))(Email);
