import React, { PureComponent } from 'react';
import { View, Alert, Modal, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withNavigation, NavigationActions } from 'react-navigation';
import { Loading } from '@components/common';
import TwitterConnect from '@components/twitter/twitterConnect';
import { withContactSync } from '@services/apollo/contact';
import { withSocialConnect } from '@services/apollo/social';
import { userRegister, withUpdateProfile } from '@services/apollo/auth';
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

class TwitterLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  onLogin = async (twitter) => {
    const { profile, auth: { authToken, authTokenSecret } } = twitter.twitterUser;
    const { setLogin, navigation, syncContacts } = this.props;
    this.setState({ showModal: true });

    if (twitter.hasID) {
      await setLogin(twitter.userById);
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
          { text: 'Ok', onPress: () => this.connect({ profile, authToken, authTokenSecret }) },
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

  connect = async ({ profile, authToken, authTokenSecret }) => {
    this.setState({ showModal: true });
    const { socialConnect, setLogin, navigation, syncContacts } = this.props;
    const response = await socialConnect({
      id: profile.id,
      email: profile.email,
      token: authToken,
      secret: authTokenSecret,
      type: 'twitter',
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
      const firstName = twitterNameArray.slice(0, twitterNameArray.length - 1);
      const lastName = twitterNameArray[twitterNameArray.length - 1];

      const response = await updateProfile({
        firstName: firstName.join(' '),
        lastName,
        twitterId: profile.id_str,
        twitterToken,
        twitterSecret,
      });

      await setRegister({
        token: response.data.updateUser.token,
        user: response.data.updateUser.User,
      });

      navigation.replace('EmailVerified');
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
  connect(null, mapDispatchToProps))(TwitterLogin);
