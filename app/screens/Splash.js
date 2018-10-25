/* @flow */
import React, { PureComponent } from 'react';
import { Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import WelcomeInfo from '@components/auth/welcomeInfo';
import AppLoading from '@components/appLoading';
import firebase from 'react-native-firebase';
import { withVerifyToken } from '@services/apollo/auth';

class Splash extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: true });
  }

  async componentWillMount() {
    const { setLogin, setRegister, navigation, verifyToken, logout } = this.props;
    let user = await AuthService.getUser();
    let token = await AuthService.getToken();

    if (user && user.id && user.email && user.phoneNumber) {
      await verifyToken()
        .then(async (res) => {
          if (res.data.verifyToken) {
            user = res.data.verifyToken.User;
            token = res.data.verifyToken.token;

            await setLogin({ user, token });
          }
        })
        .catch(async () => {
          await logout();
          navigation.replace('Welcome');
        });
    }

    if (!user || (user && !user.id)) {
      this.setState({ loading: false });
      return;
    }

    const {
      firstName,
      lastName,
      emailVerified,
      phoneVerified,
      phoneNumber,
      agreementRead,
      agreementAccepted,
      contactSynced,
    } = user;


    if (!agreementRead) {
      navigation.replace('Agreement');
    }

    if (!agreementAccepted) {
      navigation.replace('Registration');
    }

    if (!emailVerified) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 5 });
      return;
    }

    if (!firstName || !lastName) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 6 });
      return;
    }

    if (phoneNumber === null || !phoneVerified) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 8 });
      return;
    }

    if (contactSynced === null) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 9 });
      return;
    }

    firebase.notifications().onNotificationOpened((notif) => {
      const { notification: { _data: { id, screen } } } = notif;
      this.redirect(screen, id, 'navigate');
    });

    const initialNotification = await firebase.notifications().getInitialNotification();

    if (initialNotification) {
      const { notification: { _data: { id, screen } } } = initialNotification;
      this.redirect(screen, id, 'replace');
    } else {
      navigation.replace('Tab');
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        if (url) {
          this.navigate(url);
        }
      });
    }
  }


  redirect = (screen, id, type) => {
    const { navigation } = this.props;

    if (screen === 'TripDetail') {
      navigation[type](screen, { id });
    }

    if (screen === 'GroupDetail') {
      navigation[type](screen, { id });
    }

    if (screen === 'Profile') {
      navigation[type](screen, { profileId: parseInt(id, 0) });
    }

    if (screen === 'ExperienceDetail') {
      navigation[type](screen, { id });
    }

    if (screen === 'TripRoute') {
      navigation[type]('Route', { info: { id, __typename: 'Trip' } });
    }

    if (screen === 'GroupRoute') {
      navigation[type]('Route', { info: { id, __typename: 'Group' } });
    }

    if (screen === 'GroupArea') {
      navigation[type]('Area', { info: { id, __typename: 'Group' } });
    }
  }

  navigate = (url) => {
    const { navigation } = this.props;
    const route = url.replace(/.*?:\/\//g, '');
    const routes = route.split('/');
    const id = routes[2];
    const routeName = routes[1];

    if (routeName === 't') {
      navigation.navigate('TripDetail', { id });
    }

    if (routeName === 'g') {
      navigation.navigate('GroupDetail', { id });
    }

    if (routeName === 'e') {
      navigation.navigate('ExperienceDetail', { id });
    }

    if (routeName === 'p') {
      navigation.navigate('Profile', { profileId: parseInt(id, 10) });
    }
  }

  handleOpenURL = (event) => {
    this.navigate(event.url);
  }

  render() {
    if (this.state.loading) {
      return (<AppLoading />);
    }

    return (<WelcomeInfo />);
  }
}

Splash.propTypes = {
  setLogin: PropTypes.func.isRequired,
  navigation: PropTypes
    .shape({ navigate: PropTypes.func })
    .isRequired,
  verifyToken: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => {
    dispatch(AuthAction.register({ user, token }));
  },
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
  logout: () => dispatch(AuthAction.logout()),
});

export default compose(withVerifyToken, connect(mapStateToProps, mapDispatchToProps))(Splash);
