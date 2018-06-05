import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '@components/utils/texts';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { RoundedButton, Loading } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import Input from '@components/onBoarding/input';
import BackButton from '@components/onBoarding/backButton';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { userRegister } from '@services/apollo/auth';
import { withNavigation, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { getToast } from '@config/toast';
import FBLogin from '@components/facebook/login';
import TwitterLogin from '@components/twitter/login';
import Toast from '@components/toast';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  button: {
    width: 200,
    marginVertical: 50,
  },
  socialButton: {
    width: 200,
    marginVertical: 20,
  },
  horizontalDivider: {
    borderWidth: 0.3,
    borderColor: Colors.background.lightGray,
    width: 60,
    marginTop: 20,
  },
  text: {
    paddingVertical: 20,
    color: Colors.text.gray,
  },
});

class ConfirmEmail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ email: '', loading: false, error: '' });
  }

  componentWillMount() {
    const { auth, navigation } = this.props;
    if (auth.login) {
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
    }
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { register, setRegister } = this.props;
    const { email } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        register({ email }).then(({ data }) => {
          const { token, User } = data.register;
          setRegister({ token, user: User }).then(() => {
            this.setState({ loading: false, error: '' }, () => {
              this.onNext();
            });
          });
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
      } catch (err) {
        this.setState({ loading: false, error: getToast(err) });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors) });
    }
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  checkValidation() {
    const errors = [];
    const { email } = this.state;

    if (email === '') {
      errors.push('EMAIL_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.navigate('Onboarding', { activeStep: 3 });
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return <Loading style={{ marginVertical: 24 }} />;
    }

    return (
      <RoundedButton
        onPress={this.onSubmit}
        style={styles.button}
        bgColor={(this.state.email === '') ? Colors.background.lightGray : Colors.background.pink}
        disabled={this.state.email === ''}
      >
        {trans('global.next')}
      </RoundedButton>
    );
  }

  render() {
    const { error } = this.state;

    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <StepsHeading style={{ marginHorizontal: 30 }}>{trans('onboarding.confirm_email')}</StepsHeading>
          <Toast message={error} type="error" />
          <Input
            defaultValue={this.state.email}
            onChangeText={email => this.setState({ email })}
            keyboardType="email-address"
            returnKeyType="send"
            onSubmitEditing={this.onSubmit}
            autoCapitalize="none"
            placeholder="Fill in your e-mail"
          />
          <View style={{ marginHorizontal: 30 }}>
            {this.renderButton()}
            <View style={styles.horizontalDivider} />
            <AppText style={styles.text}>
              {trans('onboarding.or_signup_with_fb_or_twitter_instead')}
            </AppText>
            <FBLogin />
            <TwitterLogin />
            <BackButton onPress={this.goBack} leftAligned />
          </View>
        </ScrollView>
      </View>
    );
  }
}

ConfirmEmail.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    reset: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
  setRegister: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setRegister: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.register({ user, token }))),
});

export default compose(withNavigation,
  userRegister,
  connect(mapStateToProps,
    mapDispatchToProps))(ConfirmEmail);
