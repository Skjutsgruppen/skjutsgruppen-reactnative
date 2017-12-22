/* global fetch */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { withgetUserByFbId } from '@services/apollo/facebook';
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
        const { token, user } = await this.getUserByFbId(fbUser.profile.id);
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
      const { token, user } = await this.getUserByFbId(fbUser.profile.id);
      this.setState({ loading: false }, () => {
        this.props.onLogin(fbUser, { token, user });
      });
    } catch (error) {
      console.warn(error);
      this.setState({ loading: false });
    }
  }

  async onLoginFound(data) {
    const fbUser = data.credentials;
    const api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=picture,first_name,last_name,email,name&access_token=${fbUser.token}`;
    const response = await fetch(api);
    fbUser.profile = await response.json();
    this.setState({ loading: false, fbUser, pressContinue: true });
  }

  async getUserByFbId(id) {
    try {
      const { data } = await this.props.getUserByFbId(id);
      const { token, User } = data.getUserByFbId;
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

  render() {
    const buttonView = this.state.loading ? <Loading /> : (<FBLoginView
      onPress={this.onPressLogin}
      profile={this.state.fbUser.profile}
    />);

    return (
      <FBLogin
        buttonView={buttonView}
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
  getUserByFbId: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};


export default withgetUserByFbId(Connect);
