import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Image, Platform, Picker, Clipboard } from 'react-native';
import { Wrapper, Loading, ConfirmModal } from '@components/common';
import { connect } from 'react-redux';
import ToolBar from '@components/utils/toolbar';
import { Colors } from '@theme';
import { compose } from 'react-apollo';
import { getToast } from '@config/toast';
import { LoginManager } from 'react-native-fbsdk';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import PropTypes from 'prop-types';
import Connect from '@components/facebook/facebookConnect';
import TwitterConnect from '@components/twitter/twitterConnect';
import ImagePicker from 'react-native-image-picker';
import LangService from '@services/lang';
import I18n from 'react-native-i18n';
import { withAccount, withDeleteAccount } from '@services/apollo/profile';
import { withUpdateProfile, withResendEmailVerification, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { withSocialConnect } from '@services/apollo/social';
import SendSMS from 'react-native-sms';
import { SMS_NUMBER } from '@config';
import { NavigationActions } from 'react-navigation';

const AvailableLanguages = {
  en: 'English',
  'en-GB': 'English',
  'en-US': 'English',
  'en-AU': 'English',
  'en-CA': 'English',
  'en-NZ': 'English',
  'en-SG': 'English',
  'en-IN': 'English',
  'en-IE': 'English',
  'en-ZA': 'English',
  se: 'Swedish',
  'sv-SE': 'Swedish',
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    width: 150,
  },
  lightText: {
    color: Colors.text.gray,
  },
  bold: {
    fontWeight: '600',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 36,
  },
  avatar: {
    marginLeft: 20,
    marginRight: 32,
  },
  horizontalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  actionLabel: {
    fontSize: 16,
    color: Colors.text.blue,
  },
  deleteRow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 75,
  },
  deleteLabel: {
    color: Colors.text.red,
  },
  imageWrapper: {
    marginRight: 30,
    marginLeft: 30,
  },
  profileImage: {
    height: 62,
    width: 62,
    resizeMode: 'cover',
    borderRadius: 31,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  awaitingVerification: {
    color: Colors.text.green,
    lineHeight: 28,
  },
  resendVerification: {
    lineHeight: 28,
    color: Colors.text.blue,
  },
});

class EditProfile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: '',
      phoneNumber: '',
      profileImage: null,
      uploadedImage: null,
      loading: false,
      emailVerificationLoading: false,
      phoneVerificationLoading: false,
      firstNameLoading: false,
      lastNameLoading: false,
      facebookLinked: false,
      twitterLinked: false,
      error: '',
      success: '',
      language: 'en',
      totalFriends: null,
      newEmail: null,
      newPhoneNumber: null,
      phoneVerificationCode: null,
      modalVisibility: false,
    };
  }

  componentWillMount() {
    LangService.getLanguage().then((language) => {
      this.setState({ language: language || I18n.locale });
    });

    const {
      firstName,
      lastName,
      avatar,
      phoneNumber,
      email,
      fbId,
      totalFriends,
      twitterId,
    } = this.props.user;
    let facebookLinked = false;
    let twitterLinked = false;

    if (fbId) {
      facebookLinked = true;
    }

    if (twitterId) {
      twitterLinked = true;
    }

    this.setState({
      firstName,
      lastName,
      profileImage: avatar,
      phoneNumber,
      email,
      facebookLinked,
      twitterLinked,
      totalFriends,
    });
  }

  componentWillReceiveProps({ data }) {
    const { loading, profile } = data;
    const { email, phoneNumber, totalFriends, newEmail, newPhoneNumber } = profile;

    if (!loading) {
      this.setState({ email, phoneNumber, totalFriends, newEmail, newPhoneNumber });
    }
  }

  onConnectFB = async (fb) => {
    const { socialConnect, setUser, user } = this.props;
    if (!fb.hasID) {
      try {
        this.setState({ loading: true });
        const response = await socialConnect({
          id: fb.fbUser.profile.id,
          email: user.email,
          token: fb.fbUser.auth.accessToken,
          type: 'facebook',
        });
        setUser(response.data.connect.User);
        this.setState({ facebookLinked: true, loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
      LoginManager.logOut();
    } else {
      LoginManager.logOut();
      Alert.alert('Error', 'Facebook account is already linked with another account.');
    }
  }

  onConnectTwitter = async (twitter) => {
    const { socialConnect, setUser, user } = this.props;

    if (!twitter.hasID) {
      try {
        this.setState({ loading: true });
        const response = await socialConnect({
          id: twitter.twitterUser.auth.userID,
          email: user.email,
          token: twitter.twitterUser.auth.authToken,
          secret: twitter.twitterUser.auth.authTokenSecret,
          type: 'twitter',
        });

        setUser(response.data.connect.User);
        this.setState({ twitterLinked: true, loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
    } else {
      Alert.alert('Error', 'Twitter account is already linked with another account.');
    }
  }

  onSubmit = async ({ avatar, firstNameLoading, lastNameLoading }) => {
    this.setState({ loading: true, firstNameLoading, lastNameLoading });
    const { updateProfile, setUser } = this.props;
    const { firstName, lastName } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        let postData = { firstName, lastName };

        if (avatar) {
          postData = { ...postData, ...{ avatar } };
        }
        const res = await updateProfile(postData);
        setUser(res.data.updateUser.User);
        this.setState({ loading: false, firstNameLoading: false, lastNameLoading: false, error: '', success: getToast(['PROFILE_UPDATED']) });
      } catch (err) {
        this.setState({ loading: false, firstNameLoading: false, lastNameLoading: false, error: getToast(err), success: '' });
      }
    } else {
      this.setState({ loading: false, firstNameLoading: false, lastNameLoading: false, error: getToast(validation.errors), success: '' });
    }
  }

  setLanguage = (language) => {
    if (language === this.state.language) return;

    const { navigation } = this.props;

    this.setState({ language });
    LangService.setLanguage(language).then(() => {
      I18n.locale = language;
      navigation.replace('Tab');
    });
  }

  setConfirmModalVisibility = (visibility) => {
    this.setState({ modalVisibility: visibility, error: null });
  }

  goBack = () => {
    const { navigation } = this.props;

    navigation.goBack();
  }

  deleteAccount = () => {
    const { deleteAccount, logout } = this.props;

    this.setState({ loading: true }, () => {
      deleteAccount()
        .then(() => this.setConfirmModalVisibility(false))
        .then(() => {
          logout()
            .then(() => LoginManager.logOut())
            .then(() => this.reset())
            .catch(() => this.reset());
        })
        .catch(error => this.setState({ loading: false, error }));
    });
  }

  reset = () => {
    const { navigation } = this.props;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });
    navigation.dispatch(resetAction);
  }

  checkValidation() {
    const errors = [];
    const { firstName, lastName } = this.state;

    if (firstName === '') {
      errors.push('FIRST_NAME_REQUIRED');
    }

    if (lastName === '') {
      errors.push('LAST_NAME_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  unlinkFacebook = async () => {
    const { socialConnect, user, setUser } = this.props;
    try {
      this.setState({ loading: true });
      const response = await socialConnect({ id: '', email: user.email, token: '', type: 'facebook' });
      setUser(response.data.connect.User);
      this.setState({ facebookLinked: false, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  unlinkTwitter = async () => {
    const { socialConnect, user, setUser } = this.props;
    try {
      this.setState({ loading: true });
      const response = await socialConnect({ id: '', email: user.email, token: '', secret: '', type: 'twitter' });
      setUser(response.data.connect.User);
      this.setState({ twitterLinked: false, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  selectPhotoTapped = () => {
    const options = {
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        //
      } else if (response.customButton) {
        //
      } else {
        let source;
        if (Platform.OS === 'android') {
          source = { uri: response.uri, isStatic: true };
        } else {
          source = { uri: response.uri.replace('file://', ''), isStatic: true };
        }
        this.setState({ uploadedImage: source });
        this.onSubmit({ avatar: response.data });
      }
    });
  }

  redirect = (type) => {
    const { navigation, user: { id } } = this.props;

    if (type === 'friends') {
      navigation.navigate('UserFriends', { id });
    }

    if (type === 'password') {
      navigation.navigate('ChangePassword');
    }

    if (type === 'email') {
      navigation.navigate('ChangeEmail');
    }

    if (type === 'phone') {
      navigation.navigate('ChangePhoneNumber');
    }
  }

  resendEmailVerification = () => {
    this.setState({ emailVerificationLoading: true });
    const { resendEmailVerification } = this.props;
    const { newEmail } = this.state;

    try {
      resendEmailVerification(newEmail).then(() => {
        this.setState({ emailVerificationLoading: false });
      }).catch(() => {
        this.setState({ emailVerificationLoading: false });
      });
    } catch (err) {
      this.setState({ emailVerificationLoading: false });
    }
  }

  verifiyPhoneNumber = () => {
    const { phoneVerificationCode } = this.state;
    Clipboard.setString(phoneVerificationCode);

    SendSMS.send({
      body: phoneVerificationCode,
      recipients: [SMS_NUMBER],
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  renderEmailVerificationButton = () => {
    const { emailVerificationLoading } = this.state;

    if (emailVerificationLoading) {
      return (<Loading />);
    }

    return (<Text
      onPress={this.resendEmailVerification}
      style={styles.resendVerification}
    >Resend Verification</Text>);
  }

  renderPhoneVerificationButton = () => {
    const { phoneVerificationLoading } = this.state;
    const { navigation } = this.props;

    if (phoneVerificationLoading) {
      return (<Loading />);
    }

    return (<Text
      onPress={() => navigation.navigate('ChangePhoneNumber', { verifyPreviousNumber: true })}
      style={styles.resendVerification}
    >Verify Phone Number</Text>);
  }

  renderFacebookConnect = () => {
    const { facebookLinked } = this.state;

    if (facebookLinked) {
      return (
        <TouchableOpacity style={styles.action} onPress={this.unlinkFacebook}>
          <Text style={styles.actionLabel}>Unlink</Text>
        </TouchableOpacity>
      );
    }

    return (<Connect buttonType="link" onLogin={this.onConnectFB} />);
  }

  renderTwitterConnect = () => {
    const { twitterLinked } = this.state;

    if (twitterLinked) {
      return (
        <TouchableOpacity style={styles.action} onPress={this.unlinkTwitter}>
          <Text style={styles.actionLabel}>Unlink</Text>
        </TouchableOpacity>
      );
    }

    return (<TwitterConnect buttonType="link" onLogin={this.onConnectTwitter} />);
  }

  renderLanguage = () => {
    const { language } = this.state;
    return (
      <View style={styles.row}>
        <Text style={styles.text}>
          Language <Text style={styles.bold}> - {AvailableLanguages[language]}</Text>
        </Text>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionLabel}>Change</Text>
        </TouchableOpacity>
        <Picker
          selectedValue={language}
          onValueChange={this.setLanguage}
          style={{ width: '20%', height: '100%', opacity: 0, position: 'absolute', top: 36, right: 20, backgroundColor: 'red' }}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Swedish" value="se" />
        </Picker>
      </View>
    );
  }

  renderInfoEdit = () => {
    const { firstName, lastName, firstNameLoading, lastNameLoading } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={name => this.setState({ firstName: name })}
            onBlur={() => this.onSubmit({ firstNameLoading: true })}
            style={styles.input}
            placeholder="Your first name"
            value={firstName}
            autoCorrect={false}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
            returnKeyType="send"
            onSubmitEditing={() => this.onSubmit({ firstNameLoading: true })}
          />
          {
            firstNameLoading &&
            <View style={{ marginRight: 20 }} >
              <Loading />
            </View>
          }
        </View>
        <View style={styles.horizontalDivider} />
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={name => this.setState({ lastName: name })}
            onBlur={() => this.onSubmit({ lastNameLoading: true })}
            style={styles.input}
            placeholder="Your last name"
            value={lastName}
            autoCorrect={false}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
            returnKeyType="send"
            onSubmitEditing={() => this.onSubmit({ lastNameLoading: true })}
          />
          {
            lastNameLoading &&
            <View style={{ marginRight: 20 }} >
              <Loading />
            </View>
          }
        </View>
      </View>
    );
  }

  renderList({
    count,
    title,
    awaitingVerification,
    sendVerification,
    info,
    status,
    subtext,
    redirect,
  }) {
    return (
      <View style={styles.row}>
        <View>
          <Text style={styles.text}>
            {count && `${count}`}{title} {status && (<Text style={styles.bold}> - {status}</Text>)}
          </Text>
          {info && <Text style={styles.text}>{info}</Text>}
          {awaitingVerification &&
            <Text style={styles.awaitingVerification}>{awaitingVerification}</Text>
          }
          {sendVerification &&
            ((sendVerification === 'email')
              && this.renderEmailVerificationButton())
          }
          {sendVerification &&
            ((sendVerification === 'phone')
              && this.renderPhoneVerificationButton())
          }
          {subtext && <Text style={[styles.text, styles.lightText]}>{subtext}</Text>}
        </View>
        {
          redirect &&
          <TouchableOpacity style={styles.action} onPress={() => this.redirect(redirect)}>
            <Text style={styles.actionLabel}>Change</Text>
          </TouchableOpacity>
        }
      </View >
    );
  }

  renderModal = () => {
    const { modalVisibility, loading, error } = this.state;
    const message = (
      <Text>
        Are you sure you want to delete yourself from the movement?
      </Text>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={modalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={error !== null ? 'Retry' : 'Yes'}
        denyLabel="No"
        onConfirm={this.deleteAccount}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  render() {
    const {
      profileImage,
      phoneNumber,
      email,
      facebookLinked,
      twitterLinked,
      uploadedImage,
      totalFriends,
      newEmail,
      newPhoneNumber,
    } = this.state;

    const profilePicture = uploadedImage || { uri: profileImage };

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingBottom: 50 }}>
          <View style={[styles.nameSection]}>
            <TouchableOpacity style={styles.imageWrapper} onPress={this.selectPhotoTapped}>
              <Image
                style={styles.profileImage}
                source={profilePicture}
              />
            </TouchableOpacity>
            {this.renderInfoEdit()}
          </View>
          {
            this.renderList({
              title: 'E-mail',
              info: email,
              awaitingVerification: newEmail,
              sendVerification: newEmail ? 'email' : null,
              subtext: 'Not visible for other participants',
              redirect: 'email',
            })
          }
          {
            this.renderList({
              title: 'Phone',
              info: phoneNumber,
              awaitingVerification: newPhoneNumber,
              sendVerification: newPhoneNumber ? 'phone' : null,
              subtext: 'Not visible for other participants',
              redirect: 'phone',
            })
          }
          <View style={styles.row}>
            <View>
              <Text style={styles.text}>
                Facebook - <Text style={styles.bold}>{facebookLinked ? 'connected' : 'not connected'}</Text>
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                Visible for other participants
              </Text>
            </View>
            {this.renderFacebookConnect()}
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.text}>
                Twitter - <Text style={styles.bold}>{twitterLinked ? 'connected' : 'not connected'}</Text>
              </Text>
              <Text style={[styles.text, styles.lightText]}>
                Visible for other participants
              </Text>
            </View>
            {this.renderTwitterConnect()}
          </View>
          {
            this.renderList({
              count: `${totalFriends} `,
              title: (totalFriends <= 1) ? 'friend' : 'friends',
              subtext: 'Visible for other participants',
              redirect: 'friends',
            })
          }
          {
            this.renderList({
              title: 'Password',
              redirect: 'password',
            })
          }
          {this.renderLanguage()}
          <TouchableOpacity
            onPress={() => this.setConfirmModalVisibility(true)}
            style={styles.deleteRow}
          >
            <Text style={[styles.text, styles.deleteLabel]}>Delete yourself from the movement</Text>
          </TouchableOpacity>
          {this.renderModal()}
        </ScrollView>
      </Wrapper>
    );
  }
}

EditProfile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    phoneNumber: PropTypes.string,
    newPhoneNumber: PropTypes.string,
    email: PropTypes.string,
    fbId: PropTypes.string,
    totalFriends: PropTypes.number,
    twitterId: PropTypes.string,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      totalFriends: PropTypes.number,
    }),
    refetch: PropTypes.func,
  }).isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(
  withAccount,
  withUpdateProfile,
  withSocialConnect,
  withResendEmailVerification,
  withRegeneratePhoneVerification,
  withDeleteAccount,
  connect(mapStateToProps, mapDispatchToProps),
)(EditProfile);
