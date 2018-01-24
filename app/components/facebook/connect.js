/* global fetch */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { withGetUserByEmail, withgetUserByFbId } from '@services/apollo/facebook';
import FBLoginView from '@components/facebook/button';
import FBLink from '@components/facebook/link';
import { Loading } from '@components/common';

class Connect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, fbUser: {} };
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

  onLogin = async (data) => {
    const fbUser = data.credentials;
    fbUser.profile = data.profile;
    this.setState({ loading: true, fbUser }, this.setFBUser);
  }

  onPressLogin = async () => {
    this.setState({ loading: true }, this.setFBUser);
  }

  onLoginFound = async (data) => {
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

  setFBUser = async () => {
    const { fbUser } = this.state;
    let userByEmail = {};
    let userById = {};
    let hasEmail = true;
    let hasID = true;

    try {
      const { data } = await this.props.getUserByEmail(fbUser.profile.email);
      if (data.getUserByEmail) {
        userByEmail = { token: data.getUserByEmail.token, user: data.getUserByEmail.User };
      }
    } catch (error) {
      console.warn('User by email not found');
      hasEmail = false;
    }

    try {
      const { data } = await this.props.getUserByFbId(fbUser.userId);
      if (data.getUserByFbId) {
        userById = { token: data.getUserByFbId.token, user: data.getUserByFbId.User };
      }
    } catch (error) {
      console.warn('User by FB ID not found');
      hasID = false;
    }

    this.setState({ loading: false }, () => this.props.onLogin(
      { fbUser, userByEmail, userById, hasEmail, hasID },
    ));
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

    if (buttonType === 'signup') {
      return (<FBLoginView
        label={'Sign up with Facebook'}
        onPress={this.onPressLogin}
        profile={fbUser.profile}
      />);
    }

    if (buttonType === 'link') {
      return (<FBLink
        label={'Link'}
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
  getUserByFbId: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  cache: PropTypes.bool,
  buttonType: PropTypes.string,
};

Connect.defaultProps = {
  cache: false,
  buttonType: 'login',
};

export default withgetUserByFbId(withGetUserByEmail(Connect));
