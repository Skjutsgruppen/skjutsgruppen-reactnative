import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { RoundedButton, Loading } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { getPhoneNumber, getCountryDialCode } from '@helpers/device';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withUpdateProfile, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { withNavigation } from 'react-navigation';
import { withContactSync } from '@services/apollo/contact';
import PasswordInput from '@components/common/passwordInput';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  button: {
    width: 200,
    marginVertical: 50,
  },
  phoneInput: {
    marginTop: 30,
  },
  input: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 80,
    marginTop: 30,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.mutedBlue,
  },
});

class UserInfo extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ firstName: '', lastName: '', countryCode: '', phone: '', password: '', loading: false, error: '', inputs: {} });
  }

  componentWillMount() {
    const { auth } = this.props;

    this.setState({ firstName: auth.user.firstName || '', lastName: auth.user.lastName || '', countryCode: getCountryDialCode(), phone: getPhoneNumber() });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const {
      updateProfile,
      updateUser,
      regeneratePhoneVerification,
    } = this.props;
    const { firstName, lastName, countryCode, phone, password } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        updateProfile({
          firstName,
          lastName,
          phoneNumber: phone,
          phoneCountryCode: countryCode,
          password,
          agreementRead: true,
          agreementFalse: true,
        })
          .then(async ({ data }) => {
            const { token, User } = data.updateUser;
            const code = await regeneratePhoneVerification(null, User.email);
            User.verificationCode = code.data.regeneratePhoneVerification;
            updateUser({ token, user: User }).then(() => {
              this.onNext();
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
    const { firstName, lastName, countryCode, password } = this.state;

    if (firstName === '') {
      errors.push('FIRST_NAME_REQUIRED');
    }

    if (lastName === '') {
      errors.push('LAST_NAME_REQUIRED');
    }

    if (countryCode === '') {
      errors.push('COUNTRY_CODE_REQUIRED');
    }

    if (password === '') {
      errors.push('PASSWORD_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  focusNextField = (id) => {
    const { inputs } = this.state;

    inputs[id].focus();
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return <Loading style={{ marginVertical: 24 }} />;
    }

    return (
      <View style={styles.paddedSection}>
        <RoundedButton
          onPress={this.onSubmit}
          style={styles.button}
          bgColor={Colors.background.pink}
        >
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }

  render() {
    const { error, inputs } = this.state;

    return (
      <ScrollView>
        <StepsHeading style={styles.paddedSection}>{trans('onboarding.whats_your_name')}</StepsHeading>
        <Toast message={error} type="error" />
        <StepsTitle style={styles.paddedSection}>
          {trans('onboarding.your_email_is_confirmed_fill_first_and_last_name')}
        </StepsTitle>
        <TextInput
          style={styles.input}
          placeholder={trans('onboarding.your_first_name')}
          onChangeText={firstName => this.setState({ firstName })}
          autoCapitalize="words"
          onSubmitEditing={() => {
            this.focusNextField('two');
          }}
          value={this.state.firstName}
          autoFocus
          ref={(input) => { inputs.one = input; }}
          returnKeyType="next"
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.input}
          placeholder={trans('onboarding.your_last_name')}
          onChangeText={lastName => this.setState({ lastName })}
          value={this.state.lastName}
          autoCapitalize="words"
          ref={(input) => { inputs.two = input; }}
          underlineColorAndroid="transparent"
        />
        <PasswordInput
          onChangeText={password => this.setState({ password })}
          onSubmitEditing={this.onSubmit}
          returnKeyType="send"
          value={this.state.password}
        />
        {this.renderButton()}
      </ScrollView>
    );
  }
}

UserInfo.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    auth: state.auth,
    phoneVerificationCode: state.auth.phoneVerification,
  }
);

const mapDispatchToProps = dispatch => ({
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
  setPhoneVerificationCode: code => AuthService.setPhoneVerification(code)
    .then(() => dispatch(AuthAction.phoneVerification(code)))
    .catch(error => console.warn(error)),
});

export default compose(
  withUpdateProfile,
  withRegeneratePhoneVerification,
  withNavigation,
  withContactSync,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserInfo);
