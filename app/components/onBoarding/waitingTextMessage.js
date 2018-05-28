import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import BackButton from '@components/onBoarding/backButton';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withPhoneVerified } from '@services/apollo/auth';
import PropTypes from 'prop-types';
import { withNavigation, NavigationActions } from 'react-navigation';
import { trans } from '@lang/i18n';
import { withRemoveAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import firebase from 'react-native-firebase';
import { LoginManager } from 'react-native-fbsdk';
import { resetLocalStorage } from '@services/apollo/dataSync';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  text: {
    color: Colors.text.gray,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    width: 200,
    marginTop: 32,
    marginBottom: 50,
  },
});

class WaitingTextMessage extends Component {
  constructor(props) {
    super(props);
    this.state = ({ user: {}, token: null });
    this.interval = null;
  }

  async componentWillMount() {
    const user = await AuthService.getUser();
    this.setState({ user }, this.setPolling);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  setPolling() {
    const { isPhoneVerified, setLogin } = this.props;
    const { user } = this.state;
    this.interval = setInterval(() => {
      try {
        isPhoneVerified(user.id).then(({ data }) => {
          if (data.isPhoneVerified.User.phoneVerified) {
            setLogin({
              token: data.isPhoneVerified.token,
              user: data.isPhoneVerified.User,
            }).then(() => {
              // navigation.replace('MobileVerified');
              this.onNext();
            }).catch(console.warn);
          }
        }).catch(console.warn);
      } catch (err) {
        console.warn(err);
      }
    }, 10000);
  }

  logout = () => {
    const { logout, removeAppToken } = this.props;
    this.setState({ loading: true }, async () => {
      await removeAppToken(getDeviceId());
      await firebase.notifications().cancelAllNotifications();
      logout()
        .then(() => LoginManager.logOut())
        .then(() => this.reset())
        .catch(() => this.reset());
    });
  }

  reset = () => {
    const { navigation } = this.props;
    resetLocalStorage();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });
    navigation.dispatch(resetAction);
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.paddedSection}>
          <StepsHeading>{trans('onboarding.waiting_for_your_text_message')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.the_system_is_waiting_for_your_text_message')}
          </StepsTitle>
          <AppText style={styles.text}>
            {trans('onboarding.did_something_go_wrong_press_back')}
          </AppText>
          <BackButton onPress={this.logout} leftAligned />
        </View>
      </ScrollView>
    );
  }
}

WaitingTextMessage.propTypes = {
  isPhoneVerified: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  removeAppToken: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ phoneVerificationCode: state.auth.phoneVerification });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

export default compose(withPhoneVerified,
  withNavigation,
  withRemoveAppToken,
  connect(mapStateToProps, mapDispatchToProps))(WaitingTextMessage);
