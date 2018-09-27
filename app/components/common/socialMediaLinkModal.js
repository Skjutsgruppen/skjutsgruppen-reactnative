import React, { PureComponent } from 'react';
import { StyleSheet, View, Modal, ViewPropTypes, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { GhostButton } from '@components/common';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';
import Connect from '@components/facebook/facebookConnect';
import TwitterConnect from '@components/twitter/twitterConnect';
import { withSocialConnect } from '@services/apollo/social';
import { LoginManager } from 'react-native-fbsdk';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    maxWidth: '100%',
    minWidth: 300,
    margin: 20,
    paddingTop: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  actions: {
    minWidth: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGray,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border.lightGray,
  },
  link: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
  },
});

class SocialMediaLinkModal extends PureComponent {
  onConnectFB = async (fb) => {
    const { socialConnect, setUser, user } = this.props;
    if (!fb.hasID) {
      try {
        const response = await socialConnect({
          id: fb.fbUser.profile.id,
          email: user.email,
          token: fb.fbUser.auth.accessToken,
          type: 'facebook',
        });
        setUser(response.data.connect.User);
        LoginManager.logOut();
        this.props.onConfirm();
      } catch (error) {
        this.props.onConfirm();
      }
    } else {
      LoginManager.logOut();
      Alert.alert('Error', trans('profile.fb_account_is_already_linked_with_another_account'));
    }
  }

  onConnectTwitter = async (twitter) => {
    const { socialConnect, setUser, user } = this.props;

    if (!twitter.hasID) {
      try {
        const response = await socialConnect({
          id: twitter.twitterUser.auth.userID,
          email: user.email,
          token: twitter.twitterUser.auth.authToken,
          secret: twitter.twitterUser.auth.authTokenSecret,
          type: 'twitter',
        });

        setUser(response.data.connect.User);
        this.props.onConfirm();
      } catch (error) {
        this.props.onConfirm();
      }
    } else {
      Alert.alert('Error', trans('profile.twitter_account_is_already_linked_with_another_account'));
    }
  }

  render() {
    const {
      style,
      visible,
      message,
      onRequestClose,
      denyLabel,
      denyTextColor,
      cancelable,
      onDeny,
      media,
    } = this.props;
    return (
      <Modal
        transparent
        visible={visible}
        animationType={'fade'}
        onRequestClose={onRequestClose}
      >
        <View style={[styles.backdrop, style]}>
          <View style={[styles.content]}>
            {
              <View>
                <AppText style={styles.message}>{message}</AppText>
                <View style={styles.actions}>
                  <View style={styles.link}>
                    {media === 'Facebook' ?
                      <Connect buttonType="link" onLogin={this.onConnectFB} showModal={false} />
                      : <TwitterConnect buttonType="link" onLogin={this.onConnectTwitter} />
                    }
                  </View>
                  {cancelable && <View style={styles.verticalDivider} />}
                  {cancelable && (
                    <GhostButton
                      label={denyLabel}
                      onPress={onDeny}
                      color={denyTextColor}
                    />
                  )}
                </View>
              </View>
            }
          </View>
        </View>
      </Modal>
    );
  }
}

SocialMediaLinkModal.propTypes = {
  style: ViewPropTypes.style,
  visible: PropTypes.bool,
  message: PropTypes.node.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  denyLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  denyTextColor: PropTypes.string,
  cancelable: PropTypes.bool,
  media: PropTypes.string,
  socialConnect: PropTypes.func.isRequired,
};

SocialMediaLinkModal.defaultProps = {
  style: {},
  visible: false,
  denyTextColor: null,
  denyLabel: 'Cancel',
  cancelable: true,
  media: 'Facebook',
};

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
});

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withSocialConnect,
  connect(mapStateToProps, mapDispatchToProps),
)(SocialMediaLinkModal);
