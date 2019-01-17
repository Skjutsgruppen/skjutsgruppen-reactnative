import React, { PureComponent } from 'react';
import { Alert, StyleSheet, View, Text, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { LoginManager } from 'react-native-fbsdk';
import { userRegister, withUpdateProfile, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { withSocialConnect } from '@services/apollo/social';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import firebase from 'react-native-firebase';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Connect from '@components/facebook/facebookConnect';
import { Loading, RoundedButton } from '@components/common';
import { withNavigation, NavigationActions } from 'react-navigation';
import { withContactSync } from '@services/apollo/contact';
import { withStoreAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.64)',
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
    overflow: 'hidden',
  },
  or: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text.blue,
    textAlign: 'center',
    marginVertical: 16,
  },
});


class FBLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, showModal: false, noFBEmail: false };
  }

  onLogin = async (fb) => {
    const { profile, auth: { accessToken } } = fb.fbUser;

    if (!profile.email || profile.email === '') {
      LoginManager.logOut();
      this.setState({ noFBEmail: true });
      return;
    }

    const {
      setLogin,
      navigation,
      syncContacts,
      storeAppToken,
      regeneratePhoneVerification,
    } = this.props;
    this.setState({ showModal: true });

    if (!fb.hasEmail && !fb.hasID) {
      this.setState({ showModal: false });
      if (this.props.signup) {
        this.register(fb.fbUser);
      } else {
        this.signupWithFacebook(() => navigation.replace('Agreement', { skipUpdateProfile: true, user: fb.fbUser }));
      }

      return;
    }

    if (fb.hasID) {
      const userById = fb.userById;

      await setLogin(fb.userById);

      if (!userById.user.agreementRead) {
        navigation.replace('Agreement');

        return;
      }

      if (!userById.user.agreementAccepted) {
        navigation.replace('Registration');

        return;
      }

      if (!userById.user.phoneVerified) {
        const code = await regeneratePhoneVerification(null, userById.user.email);
        userById.user.verificationCode = code.data.regeneratePhoneVerification;

        await setLogin(fb.userById);
        navigation.replace('Onboarding', { activeStep: 8 });

        return;
      }

      if (userById.user.contactSynced === null) {
        navigation.replace('Onboarding', { activeStep: 9 });

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

    if (fb.hasEmail) {
      this.setState({ showModal: false });

      Alert.alert(`User already exist with ${profile.email}`,
        'Would you like to connect with facebook?',
        [
          { text: 'Cancel', onPress: () => null },
          { text: 'OK', onPress: () => this.connect({ profile, accessToken, fb }) },
        ],
      );
      return;
    }

    if (this.props.signup) {
      this.register(fb.fbUser);
    } else {
      this.setState({ showModal: false });
      this.signupWithFacebook(() => this.register(fb.fbUser));
    }
  }

  connect = async ({ profile, accessToken, fb }) => {
    this.setState({ showModal: true });
    const {
      socialConnect,
      setLogin,
      navigation,
      syncContacts,
      storeAppToken,
      regeneratePhoneVerification,
    } = this.props;

    if (!fb.userByEmail.user.agreementRead) {
      navigation.replace('Agreement', { skipUpdateProfile: true, user: fb.fbUser, connectToFacebook: true });

      return;
    }

    if (!fb.userByEmail.user.agreementAccepted) {
      navigation.replace('Registration', { skipUpdateProfile: true, user: fb.fbUser, connectToFacebook: true });

      return;
    }

    const response = await socialConnect({
      id: profile.id,
      email: profile.email,
      token: accessToken,
      type: 'facebook',
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

    firebase.messaging().getToken()
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

  async register({ profile, auth: { accessToken: fbToken } }) {
    if (profile.email === '') {
      Alert.alert('Error!', 'Email is required');
      return;
    }
    const { register, setRegister, updateProfile, navigation } = this.props;
    const { email, first_name: firstName, last_name: lastName } = profile;
    try {
      const { data } = await register({
        email,
        verified: true,
      });

      const { token, User } = data.register;
      await setRegister({ token, user: User });

      const response = await updateProfile({
        fbId: profile.id,
        fbToken,
        agreementRead: true,
        agreementAccepted: true,
      });

      await setRegister({
        token: response.data.updateUser.token,
        user: { ...response.data.updateUser.User, ...{ firstName, lastName } },
      }, true);

      navigation.replace('Onboarding', { activeStep: 6 });
    } catch (error) {
      console.warn(error);
    }
  }

  signupWithFacebook = (register) => {
    Alert.alert('Sign up with facebook',
      'You are not signed up with facebook. Please tap on sign up button to continue with facebook.',
      [
        { text: 'Not Now', onPress: () => this.setState({ loading: false }) },
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
            <View style={styles.modalContentBody}>
              <Loading />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderNoFBEailModal = () => (
    <Modal
      transparent
      animationType={'fade'}
      visible={this.state.noFBEmail}
      onRequestClose={() => { this.setState({ noFBEmail: false }); }}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <AppText style={styles.text}>
            {trans('onboarding.no_fb_email')}
          </AppText>
          <AppText style={styles.text}>
            {trans('onboarding.in_order_to_participate_the_movement')}
          </AppText>
          <AppText style={styles.text}>
            {trans('onboarding.update_fb_email_or_sign_up_the_long_way')}
          </AppText>
          <AppText style={styles.or}>Or</AppText>
          <View>
            <RoundedButton
              onPress={this.props.signupLongWay}
              style={styles.button}
              bgColor={Colors.background.pink}
            >
              Sign up the long way
            </RoundedButton>
            <RoundedButton
              onPress={() => { this.setState({ noFBEmail: false }); }}
              style={styles.button}
              bgColor={Colors.background.gray}
            >
              {trans('global.cancel')}
            </RoundedButton>
          </View>
        </View>
      </View>
    </Modal>
  )

  render() {
    return (
      <View>
        <Connect buttonType={this.props.signup ? 'signup' : 'login'} onLogin={this.onLogin} />
        {this.renderModal()}
        {this.renderNoFBEailModal()}
      </View>
    );
  }
}

FBLogin.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  register: PropTypes.func.isRequired,
  setRegister: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  socialConnect: PropTypes.func.isRequired,
  signup: PropTypes.bool,
  signupLongWay: PropTypes.func,
  storeAppToken: PropTypes.func.isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
};

FBLogin.defaultProps = {
  signup: false,
  signupLongWay: () => {},
};

const mapDispatchToProps = dispatch => ({
  setRegister: async ({ user, token }, reduxOnly = false) => {
    await dispatch(AuthAction.register({ user, token }));
    if (!reduxOnly) {
      await AuthService.setAuth({ user, token });
    }
  },
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.warn(error)),
});

export default compose(
  userRegister,
  withUpdateProfile,
  withSocialConnect,
  withNavigation,
  withContactSync,
  withStoreAppToken,
  withRegeneratePhoneVerification,
  connect(null, mapDispatchToProps),
)(FBLogin);
