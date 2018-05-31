import React, { PureComponent } from 'react';
import { View, Alert, Modal, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import firebase from 'react-native-firebase';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withNavigation, NavigationActions } from 'react-navigation';
import { Loading } from '@components/common';
import TwitterConnect from '@components/twitter/twitterConnect';
import { withContactSync } from '@services/apollo/contact';
import { withSocialConnect } from '@services/apollo/social';
import { userRegister, withUpdateProfile, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { Colors } from '@theme';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
});

class TwitterLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  onLogin = async (twitter) => {
    const { profile, auth: { authToken, authTokenSecret } } = twitter.twitterUser;
    const {
      setLogin,
      navigation,
      syncContacts,
      storeAppToken,
    } = this.props;

    this.setState({ showModal: true });

    if (!twitter.hasEmail && !twitter.hasID) {
      this.setState({ showModal: false });
      if (this.props.signup) {
        this.register(twitter.twitterUser);
      } else {
        this.signUpWithTwitter(() => navigation.replace('Agreement', { skipUpdateProfile: true, user: twitter.twitterUser }));
      }

      return;
    }

    if (twitter.hasID) {
      const userById = twitter.userById;

      await setLogin(twitter.userById);

      if (!userById.user.agreementRead) {
        navigation.replace('Agreement');

        return;
      }

      if (!userById.user.agreementAccepted) {
        navigation.replace('Registration');

        return;
      }

      if (!userById.user.phoneVerified) {
        await setLogin(twitter.userById);
        navigation.replace('Onboarding', { activeStep: 8 });

        return;
      }

      await firebase.messaging().getToken()
        .then(appToken => storeAppToken(appToken, getDeviceId()));

      navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Tab',
            }),
          ],
        }),
      );

      syncContacts();

      return;
    }

    if (twitter.hasEmail) {
      this.setState({ showModal: false });

      Alert.alert(`User already exist with ${profile.email}`,
        'Would you like to connect with Twitter?',
        [
          { text: 'Cancel', onPress: () => null },
          { text: 'Ok', onPress: () => this.connect({ profile, authToken, authTokenSecret, twitter }) },
        ],
      );
      return;
    }

    if (this.props.signup) {
      this.register(twitter.twitterUser);
    } else {
      this.setState({ showModal: false });
      this.signUpWithTwitter(() => this.register(twitter.twitterUser));
    }
  }

  connect = async ({ profile, authToken, authTokenSecret, twitter }) => {
    this.setState({ showModal: true });
    const {
      socialConnect,
      setLogin,
      navigation,
      syncContacts,
      storeAppToken,
      regeneratePhoneVerification,
    } = this.props;

    if (!twitter.userByEmail.user.agreementRead) {
      navigation.replace('Agreement', { skipUpdateProfile: true, user: twitter.twitterUser, connectToTwitter: true });

      return;
    }

    if (!twitter.userByEmail.user.agreementAccepted) {
      navigation.replace('Registration', { skipUpdateProfile: true, user: twitter.twitterUser, connectToTwitter: true });

      return;
    }

    const response = await socialConnect({
      id: profile.id_str,
      email: profile.email,
      token: authToken,
      secret: authTokenSecret,
      type: 'twitter',
    });

    const { User, token } = response.data.connect;

    if (!User.agreementRead) {
      navigation.replace('Agreement');

      return;
    }

    if (!User.agreementAccepted) {
      navigation.replace('Registration');

      return;
    }

    if (!User.phoneNumber) {
      const code = await regeneratePhoneVerification(null, User.email);
      User.verificationCode = code.data.regeneratePhoneVerification;
      await setLogin({ user: User });

      navigation.replace('Onboarding', { activeStep: 8 });

      return;
    }

    if (!User.phoneVerified) {
      navigation.replace('Onboarding', { activeStep: 8 });

      return;
    }

    await setLogin({
      token,
      user: User,
    });

    await firebase.messaging().getToken()
      .then(appToken => storeAppToken(appToken, getDeviceId()));

    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Tab',
          }),
        ],
      }),
    );

    syncContacts();
  }

  register = async ({
    profile,
    auth: { authToken: twitterToken, authTokenSecret: twitterSecret },
  }) => {
    if (profile.email === '') {
      Alert.alert('Error!', 'Email is required');
      return;
    }

    const { register, setRegister, updateProfile, navigation } = this.props;

    try {
      const { data } = await register({
        email: profile.email,
        verified: true,
      });

      const { token, User } = data.register;
      await setRegister({ token, user: User });

      const twitterNameArray = profile.name.split(' ');
      let firstName = '';
      let lastName = '';
      if (twitterNameArray.length > 1) {
        firstName = twitterNameArray.slice(0, twitterNameArray.length - 1);
        firstName = firstName.join(' ');
        lastName = twitterNameArray[twitterNameArray.length - 1];
      } else {
        lastName = twitterNameArray[twitterNameArray.length - 1];
      }

      const response = await updateProfile({
        firstName,
        lastName,
        twitterId: profile.id_str,
        twitterToken,
        twitterSecret,
        agreementRead: true,
        agreementAccepted: true,
      });

      await setRegister({
        token: response.data.updateUser.token,
        user: response.data.updateUser.User,
      });

      navigation.replace('Onboarding', { activeStep: 6 });
    } catch (err) {
      console.warn(err, err.graphQLErrors[0].code);
    }
  }

  signUpWithTwitter = (register) => {
    Alert.alert('Sign up with twitter',
      'You are not signed up with Twitter. Please tap on sign up button to continue with Twitter.',
      [
        { text: 'Not now', onPress: () => null },
        { text: 'Sign up', onPress: register },
      ],
    );
  }

  renderModal = () => {
    const { showModal } = this.state;

    return (
      <Modal
        transparent
        animationType={'fade'}
        visible={showModal}
        onRequestClose={() => null}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalContent}>
            <Loading />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View>
        <TwitterConnect buttonType={this.props.signup ? 'signup' : 'login'} onLogin={this.onLogin} />
        {this.renderModal()}
      </View>
    );
  }
}

TwitterLogin.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  signup: PropTypes.bool,
  storeAppToken: PropTypes.func.isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
};

TwitterLogin.defaultProps = {
  signup: false,
};

const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token })))
    .catch(error => console.warn(error)),
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
});

export default compose(withNavigation,
  userRegister,
  withContactSync,
  withSocialConnect,
  withUpdateProfile,
  withStoreAppToken,
  withRegeneratePhoneVerification,
  connect(null, mapDispatchToProps))(TwitterLogin);
