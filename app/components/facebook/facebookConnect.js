/* global fetch */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { withGetUserByEmail, withgetUserByFbId } from '@services/apollo/social';
import { compose } from 'react-apollo';
import { Colors } from '@theme';
import { Loading, RoundedButton } from '@components/common';

const styles = StyleSheet.create({
  actionLabel: {
    fontSize: 16,
    color: Colors.text.blue,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.64)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  button: {
    width: 200,
    marginVertical: 20,
  },
});

class FacebookConnect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showModal: false, fbUser: {} };
  }

  setFBUser = async () => {
    const { fbUser } = this.state;
    const { getUserByEmail, getUserByFbId } = this.props;

    let userByEmail = {};
    let userById = {};
    let hasEmail = true;
    let hasID = true;

    try {
      const { data } = await getUserByEmail(fbUser.profile.email);
      if (data.getUserByEmail) {
        userByEmail = { token: data.getUserByEmail.token, user: data.getUserByEmail.User };
      }
    } catch (error) {
      hasEmail = false;
    }

    try {
      const { data } = await getUserByFbId(fbUser.profile.id);
      if (data.getUserByFbId) {
        userById = { token: data.getUserByFbId.token, user: data.getUserByFbId.User };
      }
    } catch (error) {
      hasID = false;
    }

    this.setState({ showModal: false }, () => this.props.onLogin(
      { fbUser, userByEmail, userById, hasEmail, hasID },
    ));
  }

  handleFacebookLogin = () => {
    try {
      this.setState({ showModal: true });
      LoginManager.logInWithReadPermissions(['public_profile', 'email'])
        .then((result) => {
          if (result.isCancelled) {
            this.setState({ showModal: false });
          } else {
            AccessToken.getCurrentAccessToken().then(
              async (data) => {
                const fbUser = {};
                fbUser.auth = data;
                const api = `https://graph.facebook.com/v2.3/${data.userID}?fields=picture,first_name,last_name,email,name&access_token=${data.accessToken}`;
                const response = await fetch(api);
                fbUser.profile = await response.json();
                this.setState({ fbUser, showModal: false }, this.setFBUser);
              });
          }
        });
    } catch (err) {
      this.setState({ showModal: false });
    }
  }

  renderButton = () => {
    const { buttonType } = this.props;

    if (buttonType === 'login' || buttonType === 'signup') {
      return (
        <RoundedButton
          onPress={this.handleFacebookLogin}
          style={styles.button}
          bgColor={Colors.background.facebook}
          icon={require('@assets/icons/ic_facebook_white.png')}
        >
          Facebook
        </RoundedButton>);
    }

    if (buttonType === 'link') {
      return (
        <Text
          onPress={this.handleFacebookLogin}
          style={styles.actionLabel}
        >Link</Text>
      );
    }

    return null;
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
        {this.renderButton()}
        {this.props.showModal && this.renderModal()}
      </View>
    );
  }
}

FacebookConnect.propTypes = {
  onLogin: PropTypes.func.isRequired,
  getUserByEmail: PropTypes.func.isRequired,
  getUserByFbId: PropTypes.func.isRequired,
  buttonType: PropTypes.string,
  showModal: PropTypes.bool,
};

FacebookConnect.defaultProps = {
  buttonType: 'login',
  showModal: true,
};

export default compose(withGetUserByEmail, withgetUserByFbId)(FacebookConnect);
