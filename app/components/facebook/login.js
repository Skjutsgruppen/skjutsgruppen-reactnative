import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { userRegister, withUpdateProfile } from '@services/apollo/auth';
import { withFacebookConnect } from '@services/apollo/facebook';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Connect from '@components/facebook/connect';
import { Loading } from '@components/common';

class FBLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  onLogin = async (fb) => {
    const { profile, token } = fb.fbUser;
    const { setLogin, navigation } = this.props;
    this.setState({ loading: true });

    if (fb.hasID) {
      await setLogin(fb.userById);
      navigation.replace('Tab');
      return;
    }

    if (fb.hasEmail) {
      Alert.alert(`User already exist with ${profile.email}`,
        'Would you like to connect with facebook?',
        [
          { text: 'Cancel', onPress: () => this.setState({ loading: false }) },
          { text: 'OK', onPress: () => this.connect({ profile, token }) },
        ],
      );
      return;
    }

    if (this.props.signup) {
      this.register(fb.fbUser);
    } else {
      this.signupWithFacebook(() => this.register(fb.fbUser));
    }
  }

  async connect({ profile, token }) {
    const { facebookConnect, setLogin, navigation } = this.props;

    const response = await facebookConnect({
      id: profile.id,
      email: profile.email,
      token,
    });

    await setLogin({
      token: response.data.connect.token,
      user: response.data.connect.User,
    });

    navigation.replace('Tab');
  }

  async register({ profile, token: fbToken }) {
    if (profile.email === '') {
      Alert.alert('Error!', 'Email is required');
      return;
    }
    const { register, setRegister, updateProfile, navigation } = this.props;

    try {
      const { data } = await register({
        email: profile.email,
        verified: profile.verified,
      });

      const { token, User } = data.register;
      await setRegister({ token, user: User });

      const response = await updateProfile({
        firstName: profile.first_name,
        lastName: profile.last_name,
        fbId: profile.id,
        fbToken,
      });
      await setRegister({
        token: response.data.updateUser.token,
        user: response.data.updateUser.User,
      });

      if (profile.verified) {
        navigation.replace('EmailVerified');
      } else {
        navigation.replace('CheckMail');
      }
    } catch (error) {
      console.warn(error, error.graphQLErrors[0].code);
    }
  }

  signupWithFacebook = (register) => {
    Alert.alert('Sign up with facebook',
      'You are not sign up with facebook. Please tap on sign up button to continue with facebook.',
      [
        { text: 'Not Now', onPress: () => this.setState({ loading: false }) },
        { text: 'Sign up', onPress: register },
      ],
    );
  }

  render() {
    if (this.state.loading) {
      return (<Loading />);
    }

    return (
      <Connect buttonType={this.props.signup ? 'signup' : 'login'} onLogin={this.onLogin} />
    );
  }
}

FBLogin.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  register: PropTypes.func.isRequired,
  setRegister: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  facebookConnect: PropTypes.func.isRequired,
  signup: PropTypes.bool,
};

FBLogin.defaultProps = {
  signup: false,
};

const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token })))
    .catch(error => console.warn(error)),
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
});

export default compose(
  userRegister, withUpdateProfile, withFacebookConnect,
  connect(null, mapDispatchToProps),
)(FBLogin);
