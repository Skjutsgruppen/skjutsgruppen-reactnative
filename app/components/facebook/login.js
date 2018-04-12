import React, { PureComponent } from 'react';
import { Alert, StyleSheet, View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { userRegister, withUpdateProfile } from '@services/apollo/auth';
import { withSocialConnect } from '@services/apollo/social';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Connect from '@components/facebook/facebookConnect';
import { Loading } from '@components/common';
import { withNavigation, NavigationActions } from 'react-navigation';
import { withContactSync } from '@services/apollo/contact';
import { Colors } from '@theme';

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

class FBLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, showModal: false };
  }

  onLogin = async (fb) => {
    const { profile, auth: { accessToken } } = fb.fbUser;
    const { setLogin, navigation, syncContacts } = this.props;
    this.setState({ showModal: true });

    if (fb.hasID) {
      await setLogin(fb.userById);
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
          { text: 'OK', onPress: () => this.connect({ profile, accessToken }) },
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

  connect = async ({ profile, accessToken }) => {
    this.setState({ showModal: true });
    const { socialConnect, setLogin, navigation, syncContacts } = this.props;
    const response = await socialConnect({
      id: profile.id,
      email: profile.email,
      token: accessToken,
      type: 'facebook',
    });

    await setLogin({
      token: response.data.connect.token,
      user: response.data.connect.User,
    });

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

    try {
      const { data } = await register({
        email: profile.email,
        verified: true,
      });

      const { token, User } = data.register;
      await setRegister({ token, user: User });

      const response = await updateProfile({
        firstName: profile.first_name,
        lastName: profile.last_name,
        fbId: profile.id,
        fbToken,
      });

      await setRegister({
        token: response.data.updateUser.token,
        user: response.data.updateUser.User,
      });

      navigation.replace('EmailVerified');
    } catch (error) {
      console.warn(error, error.graphQLErrors[0].code);
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
            <Loading />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View>
        <Connect buttonType={this.props.signup ? 'signup' : 'login'} onLogin={this.onLogin} />
        {this.renderModal()}
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
};

FBLogin.defaultProps = {
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

export default compose(
  userRegister,
  withUpdateProfile,
  withSocialConnect,
  withNavigation,
  withContactSync,
  connect(null, mapDispatchToProps),
)(FBLogin);
