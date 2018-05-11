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
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';

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

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
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
          <BackButton onPress={this.goBack} leftAligned />
        </View>
      </ScrollView>
    );
  }
}

WaitingTextMessage.propTypes = {
  isPhoneVerified: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ phoneVerificationCode: state.auth.phoneVerification });
const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
});

export default compose(withPhoneVerified,
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps))(WaitingTextMessage);
