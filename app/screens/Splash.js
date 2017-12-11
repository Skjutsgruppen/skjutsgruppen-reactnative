/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import Onboarding from '@components/auth/onboarding';

class Splash extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = ({ loading: true });
  }

  async componentWillMount() {
    const { setLogin, setRegister, auth } = this.props;
    const user = await AuthService.getUser();
    const token = await AuthService.getToken();
    const hasUser = await AuthService.hasUser();
    const isLoggedIn = await AuthService.isLoggedIn();

    if (hasUser && !user.emailVerified) {
      await setRegister({ user, token });
      this.navigateTo('CheckMail');
      return;
    }

    if (hasUser && user.emailVerified && user.phoneNumber === null) {
      await setRegister({ user, token });
      this.navigateTo('EmailVerified');
      return;
    }

    if (hasUser && !user.phoneVerified) {
      await setRegister({ user, token });
      this.navigateTo('SendText');
      return;
    }


    if (auth.login) {
      this.navigateTo('Tab');
      return;
    }

    if (isLoggedIn) {
      await setLogin({ user, token });
      this.navigateTo('Tab');
      return;
    }

    this.setState({ loading: false });
  }

  navigateTo = (routeName) => {
    const { navigation } = this.props;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  render() {
    const { navigation } = this.props;

    return (
      <Onboarding
        handleLogin={() => navigation.navigate('LoginMethod')}
        handleRegister={() => navigation.navigate('RegisterMethod')}
        loading={this.state.loading}
      />
    );
  }
}

Splash.propTypes = {
  setLogin: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => {
    dispatch(AuthAction.login({ user, token }));
  },
  setRegister: ({ user, token }) => {
    dispatch(AuthAction.register({ user, token }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
