/* @flow */
import React, { PureComponent } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import Onboarding from '@components/auth/onboarding';
import AppLoading from '@components/appLoading';

class Splash extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: true });
  }

  async componentWillMount() {
    try {
      if (Platform === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      }
    } catch (err) {
      console.warn(err);
    }

    const { setLogin, setRegister, navigation } = this.props;
    const user = await AuthService.getUser();

    if (!user) {
      this.setState({ loading: false });
      return;
    }

    const { emailVerified, phoneVerified, phoneNumber } = user;
    const token = await AuthService.getToken();

    if (!emailVerified) {
      await setRegister({ user, token });
      navigation.replace('CheckMail');
      return;
    }

    if (phoneNumber === null) {
      await setRegister({ user, token });
      navigation.replace('EmailVerified');
      return;
    }

    if (!phoneVerified) {
      await setRegister({ user, token });
      navigation.replace('SendText');
      return;
    }

    await setLogin({ user, token });
    navigation.replace('Tab');
  }

  render() {
    const { navigation } = this.props;
    if (this.state.loading) {
      return (<AppLoading />);
    }

    return (<Onboarding
      handleLogin={() => navigation.navigate('LoginMethod')}
      handleRegister={() => navigation.navigate('OnBoardingFirst')}
      loading={false}
    />);
  }
}

Splash.propTypes = {
  setLogin: PropTypes.func.isRequired,
  navigation: PropTypes
    .shape({ navigate: PropTypes.func })
    .isRequired,
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
