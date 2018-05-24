import React, { PureComponent } from 'react';
import Config from 'react-native-config';
import PropTypes from 'prop-types';
import { View, StyleSheet, Modal } from 'react-native';
import TwitterAuth from 'tipsi-twitter';
import { RoundedButton, Loading } from '@components/common';
import twitter from 'react-native-twitter';
import { withGetUserByEmail, withGetUserByTwitterId } from '@services/apollo/social';
import { compose } from 'react-apollo';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  actionLabel: {
    fontSize: 16,
    color: Colors.text.blue,
  },
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
  button: {
    width: 200,
    marginVertical: 20,
  },
});

TwitterAuth.init({
  twitter_key: Config.TWITTER_CONSUMER_KEY,
  twitter_secret: Config.TWITTER_CONSUMER_SECRET,
});

class TwitterConnect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { showModal: false, twitterUser: {} };
  }

  setTwitterUser = async () => {
    const { twitterUser } = this.state;
    const { getUserByEmail, getUserByTwitterId } = this.props;

    let userByEmail = {};
    let userById = {};
    let hasEmail = true;
    let hasID = true;

    try {
      const { data } = await getUserByEmail(twitterUser.profile.email);
      if (data.getUserByEmail) {
        userByEmail = { token: data.getUserByEmail.token, user: data.getUserByEmail.User };
      }
    } catch (error) {
      hasEmail = false;
    }

    try {
      const { data } = await getUserByTwitterId(twitterUser.auth.userID);
      if (data.getUserByTwitterId) {
        userById = { token: data.getUserByTwitterId.token, user: data.getUserByTwitterId.User };
      }
    } catch (error) {
      hasID = false;
    }

    this.setState({ showModal: false }, () => this.props.onLogin(
      { twitterUser, userByEmail, userById, hasEmail, hasID },
    ));
  }

  handleTwitterLogin = async () => {
    try {
      this.setState({ showModal: true });

      const { twitterUser } = this.state;
      const twitterAuth = await TwitterAuth.login();
      const { rest } = twitter({
        consumerKey: Config.TWITTER_CONSUMER_KEY,
        consumerSecret: Config.TWITTER_CONSUMER_SECRET,
        accessToken: twitterAuth.authToken,
        accessTokenSecret: twitterAuth.authTokenSecret,
      });

      twitterUser.auth = twitterAuth;
      twitterUser.profile = await rest.get('account/verify_credentials', { include_email: true });

      this.setState({ twitterUser }, this.setTwitterUser);
    } catch (error) {
      this.setState({ showModal: false });
    }
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

  renderButton = () => {
    const { buttonType } = this.props;

    if (buttonType === 'login') {
      return (
        <RoundedButton
          onPress={this.handleTwitterLogin}
          style={styles.button}
          bgColor={Colors.background.twitter}
          icon={require('@assets/icons/ic_twitter_white.png')}
        >
          Twitter
        </RoundedButton>);
    }

    if (buttonType === 'link') {
      return (
        <AppText
          color={Colors.text.blue}
          onPress={this.handleTwitterLogin}
        >Link</AppText>
      );
    }

    return null;
  }

  render() {
    return (
      <View>
        {this.renderButton()}
        {this.renderModal()}
      </View>
    );
  }
}

TwitterConnect.propTypes = {
  buttonType: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
};

TwitterConnect.defaultProps = {
  buttonType: 'login',
};

export default compose(withGetUserByEmail, withGetUserByTwitterId)(TwitterConnect);
