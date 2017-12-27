/* global fetch */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { withGetUserByEmail } from '@services/apollo/facebook';
import FBLoginView from '@components/facebook/button';
import { Loading } from '@components/common';

class Connect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, fbUser: {} };
    this.onLoginFound = this.onLoginFound.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onPressLogin = this.onPressLogin.bind(this);
  }

  onCancel = () => {
    this.setState({ loading: false });
  }

  onLogout = () => {
    this.setState({ loading: false });
  }

  onPermissionsMissing = () => {
    this.setState({ loading: false });
  }

  async onLogin(data) {
    const fbUser = data.credentials;
    fbUser.profile = data.profile;

    this.setState({ loading: true, fbUser }, async () => {
      try {
        const { token, user } = await this.getUserByEmail(fbUser.profile.email);
        this.setState({ loading: false }, () => {
          this.props.onLogin(fbUser, { token, user });
        });
      } catch (error) {
        console.warn(error);
        this.setState({ loading: false });
      }
    });
  }

  async onPressLogin() {
    const { fbUser } = this.state;
    this.setState({ loading: true });
    try {
      const { token, user } = await this.getUserByEmail(fbUser.profile.email);
      this.setState({ loading: false }, () => {
        this.props.onLogin(fbUser, { token, user });
      });
    } catch (error) {
      console.warn(error);
      this.setState({ loading: false });
    }
  }

  async onLoginFound(data) {
    if (this.props.cache) {
      const fbUser = data.credentials;
      const api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=picture,first_name,last_name,email,name&access_token=${fbUser.token}`;
      const response = await fetch(api);
      fbUser.profile = await response.json();
      this.setState({ loading: false, fbUser, pressContinue: true });
    } else {
      this.fbLogout();
    }
  }

  async getUserByEmail(email) {
    try {
      const { data } = await this.props.getUserByEmail(email);
      const { token, User } = data.getUserByEmail;
      return { token, user: User };
    } catch (error) {
      return {};
    }
  }

  fbLogout = () => {
    FBLoginManager.logout(() => {
      this.fbLogin.logout();
    });
  };

  buttonView = () => {
    const { buttonType } = this.props;
    const { fbUser } = this.state;

    if (buttonType === 'login') {
      return (<FBLoginView
        label={'Sign in with Facebook'}
        onPress={this.onPressLogin}
        profile={fbUser.profile}
      />);
    }

    if (buttonType === 'connect') {
      return (<FBLoginView
        label={'Connect with Facebook'}
        onPress={this.onPressLogin}
        profile={fbUser.profile}
      />);
    }

    if (buttonType === 'signup') {
      return (<FBLoginView
        label={'Sign up with Facebook'}
        onPress={this.onPressLogin}
        profile={fbUser.profile}
      />);
    }

    return null;
  }

  render() {
    return (
      <FBLogin
        buttonView={this.state.loading ? <Loading /> : this.buttonView()}
        ref={(fbLogin) => { this.fbLogin = fbLogin; }}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        permissions={['email']}
        onLogin={this.onLogin}
        onLoginFound={this.onLoginFound}
        onLogout={this.onLogout}
        onCancel={this.onCancel}
        onError={this.onCancel}
        onPermissionsMissing={this.onPermissionsMissing}
      />
    );
  }
}

Connect.propTypes = {
  getUserByEmail: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  cache: PropTypes.bool,
  buttonType: PropTypes.string,
};

Connect.defaultProps = {
  cache: false,
  buttonType: 'login',
};

export default withGetUserByEmail(Connect);
