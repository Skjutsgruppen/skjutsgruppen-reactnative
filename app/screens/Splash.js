/* @flow */
import React, { PureComponent } from 'react';
import { PermissionsAndroid, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import WelcomeInfo from '@components/auth/welcomeInfo';
import AppLoading from '@components/appLoading';
import FCM, { FCMEvent } from 'react-native-fcm';

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
      if (Platform === 'android' || Platform.OS === 'android') {
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

    const { emailVerified, phoneVerified, phoneNumber, agreementRead, agreementAccepted } = user;
    const token = await AuthService.getToken();

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

    if (phoneNumber === null) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 6 });
      return;
    }

    if (!phoneVerified) {
      await setRegister({ user, token });
      navigation.replace('Onboarding', { activeStep: 8 });
      return;
    }
    await setLogin({ user, token });

    const notification = await FCM.getInitialNotification();

    FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.opened_from_tray) {
        let screen = '';
        let id = '';

        if (Platform.OS === 'android' && notif.fcm && notif.fcm.action) {
          const { action } = notif.fcm;
          const routes = action.split('/');
          screen = routes[0];
          id = parseInt(routes[1], 0);
        } else {
          screen = notif.screen;
          id = notif.id;
        }
        this.redirect(screen, id, 'navigate');
      }
    });

    if (notification && notification.screen && notification.id) {
      const id = parseInt(notification.id, 0);
      this.redirect(notification.screen, id, 'replace');
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
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  redirect = (screen, id, type) => {
    const { navigation } = this.props;

    if (screen === 'TripDetail') {
      navigation[type](screen, { trip: { id }, fetch: true });
    }

    if (screen === 'GroupDetail') {
      navigation[type](screen, { group: { id }, fetch: true });
    }

    if (screen === 'Profile') {
      navigation[type](screen, { profileId: id });
    }

    if (screen === 'ExperienceDetail') {
      navigation[type](screen, { experience: { id }, fetch: true });
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
      navigation.navigate('TripDetail', { trip: { id }, fetch: true });
    }

    if (routeName === 'g') {
      navigation.navigate('GroupDetail', { group: { id }, fetch: true });
    }

    if (routeName === 'e') {
      navigation.navigate('ExperienceDetail', { experience: { id }, fetch: true });
    }
  }

  handleOpenURL = event => this.navigate(event.url);

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
