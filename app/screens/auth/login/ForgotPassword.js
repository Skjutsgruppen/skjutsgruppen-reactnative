import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Modal, Alert } from 'react-native';
import Container from '@components/auth/container';
import AppNotification from '@components/common/appNotification';
import Colors from '@theme/colors';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import { trans } from '@lang/i18n';
import { Wrapper, Loading, RoundedButton } from '@components/common';
import { getToast } from '@config/toast';
import { withForgotPassword, withGetUserFromPhoneNumber } from '@services/apollo/auth';
import { compose } from 'react-apollo';
import BackButton from '@components/onBoarding/backButton';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';
import Phone from '@components/phone';

import WarningIcon from '@assets/icons/ic_warning.png';
import SuccessIcon from '@assets/icons/ic_checked_green.png';

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
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
  button: {
    width: 200,
    marginVertical: 50,
  },
  paddedSection: {
    paddingHorizontal: 30,
  },
  forgotEmail: {
    marginTop: 20,
    paddingVertical: 10,
    marginHorizontal: 30,
    alignSelf: 'flex-start',
  },
});

class ForgotPassword extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);

    this.state = ({
      username: '',
      loading: false,
      showNotificationBar: false,
      notificationMessage: null,
      notificationType: null,
      emailModal: false,
      phoneNumber: '',
      number: '',
    });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { forgotPassword } = this.props;
    const { username } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        forgotPassword(username)
          .then(() => this.setState({
            loading: false,
            showNotificationBar: true,
            notificationMessage: getToast(['PASSWORD_UPADTE_EMAIL_SEND']),
            notificationType: 'success',
          }))
          .catch(err => this.setState({
            loading: false,
            showNotificationBar: true,
            notificationMessage: getToast(err),
            notificationType: 'error',
          }));
      } catch (err) {
        this.setState({
          loading: false,
          showNotificationBar: true,
          notificationMessage: getToast(err),
          notificationType: 'error',
        });
      }
    } else {
      this.setState({
        loading: false,
        showNotificationBar: true,
        notificationMessage: getToast(validation.errors),
        notificationType: 'error',
      });
    }
  }

  onForgotEmail = () => {
    this.props.getUserByPhoneNumber(this.state.phoneNumber)
      .then((res) => {
        let email = '';
        if (res.data && res.data.getUserByPhoneNumber) {
          email = res.data.getUserByPhoneNumber.email;
        }
        Alert.alert('', trans('onboarding.phone_number_email', { email }));
      })
      .catch(() => {
        Alert.alert('', trans('onboarding.phone_number_email_not_found'));
      });
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  }

  onPhoneNumberChange = (code, number) => {
    let trimedNumber = '';
    if (number) {
      trimedNumber = number.replace(/^0+/, '');
    }
    this.setState({ number: trimedNumber, phoneNumber: `${code}${trimedNumber}` });
  }

  dismissNotification = () => {
    this.setState({
      showNotificationBar: false,
      notificationMessage: null,
      notificationType: null,
    });
  }

  checkValidation() {
    const errors = [];
    const { username } = this.state;

    if (username === '') {
      errors.push('USERNAME_REQUIRED');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  revealEmailModal = () => {
    const { emailModal, number } = this.state;
    return (
      <Modal
        visible={emailModal}
        animationType="slide"
        onRequestClose={() => this.setState({ emailModal: false })}
      >
        <Container>
          <StepsHeading style={[styles.paddedSection, { maxWidth: 280 }]}>{trans('onboarding.forgot_email')}</StepsHeading>
          <StepsTitle style={styles.paddedSection}>
            {trans('onboarding.enter_phone_number_to_view_email')}
          </StepsTitle>
          <Phone
            defaultCode="+46"
            placeholder={trans('profile.your_mobile_number')}
            onChange={({ code, number: num }) => this.onPhoneNumberChange(code, num)}
            value={number}
            autoFocus
          />
          <View style={styles.paddedSection}>
            <RoundedButton
              onPress={this.onForgotEmail}
              style={styles.button}
              bgColor={Colors.background.pink}
            >
              {trans('global.search')}
            </RoundedButton>
          </View>
          <View style={styles.paddedSection}>
            <BackButton leftAligned onPress={() => this.setState({ emailModal: false })} />
          </View>
        </Container>
      </Modal>
    );
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
          {trans('global.send')}
        </RoundedButton>
      </View>
    );
  }

  render() {
    const { notificationMessage, showNotificationBar, notificationType } = this.state;
    let notificationIcon = null;

    if (notificationType === 'success') {
      notificationIcon = SuccessIcon;
    } else if (notificationType === 'error') {
      notificationIcon = WarningIcon;
    }

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        {showNotificationBar && <AppNotification
          type="icon"
          image={notificationIcon}
          message={notificationMessage}
          handleClose={this.dismissNotification}
        />}
        <Container>
          <StepsHeading style={styles.paddedSection}>{trans('onboarding.forgot_password')}</StepsHeading>
          <StepsTitle style={styles.paddedSection}>
            {trans('onboarding.an_email_will_be_sent_to_your_address')}
          </StepsTitle>
          <View style={styles.inputWrapper}>
            <TextInput
              autoCapitalize="none"
              onChangeText={username => this.setState({ username })}
              style={styles.input}
              placeholder={trans('onboarding.your_email_address')}
              underlineColorAndroid="transparent"
              value={this.state.username}
              keyboardType="email-address"
              autoFocus
              onSubmitEditing={this.onSubmit}
              returnKeyType="send"
            />
          </View>
          <AppText
            color={Colors.text.blue}
            onPress={() => this.setState({ emailModal: true })}
            style={styles.forgotEmail}
            fontVariation="semibold"
          >
            {trans('onboarding.forgot_email')}
          </AppText>
          {this.renderButton()}
          <AppText style={styles.forgotEmail}>
            {trans('onboarding.no_email_access_contact_support')}
          </AppText>
          <View style={styles.paddedSection}>
            <BackButton leftAligned onPress={this.onPressBack} />
          </View>
          {this.revealEmailModal()}
        </Container>
      </Wrapper>
    );
  }
}

ForgotPassword.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  forgotPassword: PropTypes.func.isRequired,
  getUserByPhoneNumber: PropTypes.func.isRequired,
};

export default compose(
  withForgotPassword,
  withGetUserFromPhoneNumber,
  withNavigation,
)(ForgotPassword);
