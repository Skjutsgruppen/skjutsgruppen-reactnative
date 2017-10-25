/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import Onboarding from '@components/auth/onboarding';

import { createSelector } from 'reselect';

const authSelector = createSelector(state => state.auth, auth => auth);

class Splash extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = ({ loading: true });
  }

  async componentWillMount() {
    const { setLogin, setRegister, auth } = this.props;
    const user = await AuthService.get();
    const isLoggedIn = await AuthService.isLoggedIn();

    if (auth.login) {
      this.navigateTo('Tab');
    } else if (isLoggedIn) {
      await setLogin(user);
      this.navigateTo('Tab');
    } else if (user !== null && user.token !== '' && user.user.emailVerified && user.user.firstName === null) {
      await setRegister(user);
      this.navigateTo('EmailVerified');
    } else if (user !== null && user.token !== '' && !user.user.emailVerified) {
      await setRegister(user);
      this.navigateTo('CheckMail');
    } else {
      this.setState({ loading: false });
    }
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

const mapStateToProps = state => ({ auth: authSelector(state) });
const mapDispatchToProps = dispatch => ({
  setLogin: (user) => {
    dispatch(AuthAction.login(user));
  },
  setRegister: (user) => {
    dispatch(AuthAction.register(user));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
