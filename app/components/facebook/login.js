import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { userRegister, withUpdateProfile } from '@services/apollo/auth';
import { connectWithSocial } from '@services/apollo/facebook';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Connect from '@components/facebook/connect';

class FBLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.onLogin = this.onLogin.bind(this);
  }

  async onLogin(fbUser, { token, user }) {
    if (user) {
      this.props.setLogin({ token, user }).then(() => {
        this.props.navigation.navigate('Tab');
      });
    } else {
      this.signupWithFacebook(() => this.register(fbUser));
    }
  }

  async connect({ profile, fbToken }) {
    const response = await this.props.connectWithSocial({
      id: profile.id,
      email: profile.email,
      token: fbToken,
    });
    await this.props.setLogin({
      token: response.data.connect.token,
      user: response.data.connect.User,
    });
    this.props.navigation.navigate('Tab');
  }

  async register({ profile, token: fbToken }) {
    if (profile.email === '') {
      Alert.alert('Error!', 'Email is required');
      return;
    }

    try {
      const { data } = await this.props.register({
        email: profile.email,
        verified: profile.verified,
      });
      const { token, User } = data.register;
      await this.props.setRegister({ token, user: User });

      const updateProfile = await this.props.updateProfile({
        firstName: profile.first_name,
        lastName: profile.last_name,
        fbId: profile.id,
      });
      await this.props.setRegister({
        token: updateProfile.data.updateUser.token,
        user: updateProfile.data.updateUser.User,
      });

      if (profile.verified) {
        this.props.navigation.navigate('EmailVerified');
      } else {
        this.props.navigation.navigate('CheckMail');
      }
    } catch (error) {
      /* todos :
      check for proper error message
      */
      this.setState({ loading: false }, () => {
        Alert.alert(`User already exist with ${profile.email}`,
          'Would you like to connect with facebook?',
          [
            { text: 'Cancel' },
            { text: 'OK', onPress: () => this.connect({ profile, fbToken }) },
          ],
        );
      });
    }
  }

  signupWithFacebook = (register) => {
    Alert.alert('Signup with facebook',
      'You are not Sign with facebook. Please signup with facebook first.',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: register },
      ],
    );
  }

  render() {
    return (
      <Connect onLogin={this.onLogin} />
    );
  }
}

FBLogin.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  register: PropTypes.func.isRequired,
  setRegister: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  connectWithSocial: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token })))
    .catch(error => console.error(error)),
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.error(error)),
});

export default compose(
  userRegister, withUpdateProfile, connectWithSocial,
  connect(null, mapDispatchToProps),
)(FBLogin);
