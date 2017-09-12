/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';

import { createSelector } from 'reselect';

const authSelector = createSelector(state => state.auth, auth => auth);

class Splash extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = ({ loading: true });
  }

  async componentWillMount() {
    const { setLogin, auth } = this.props;

    const isLoggedin = await AuthService.isLoggedIn();
    if (auth.login) {
      this.navigateTo('Tab');
    } else if (isLoggedin) {
      const user = await AuthService.get();
      await setLogin(user);
      this.navigateTo('Tab');
    } else {
      this.navigateTo('Login');
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
    return (<Loading />);
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
