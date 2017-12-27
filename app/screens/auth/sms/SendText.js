import React, { Component } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { CustomButton, Loading } from '@components/common';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withPhoneVerified, withVerifyPhoneNumber } from '@services/apollo/profile';
import { getToast } from '@config/toast';
import Toast from '@components/new/toast';

const styles = StyleSheet.create({
  profilePic: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 40,
    marginBottom: 24,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  promise: {
    alignSelf: 'center',
    width: 180,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    opacity: 0.6,
  },
  button: {
    margin: 24,
  },
});


class SendText extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: false, loadingSendText: false, error: '', warning: '', success: '', phoneVerified: false, user: {}, token: null });
  }

  async componentWillMount() {
    const user = await AuthService.getUser();
    this.setState({ user });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { navigation, isPhoneVerified, setLogin } = this.props;
    const { user } = this.state;

    try {
      isPhoneVerified(user.id).then(({ data }) => {
        if (data.isPhoneVerified.User.phoneVerified) {
          setLogin({
            token: data.isPhoneVerified.token,
            user: data.isPhoneVerified.User,
          }).then(() => {
            navigation.reset('MobileVerified');
          }).catch((err) => {
            this.setState({ loading: false, error: getToast(err) });
          });
        } else {
          this.setState({ warning: getToast(['PHONE_NUMBER_NOT_VERIFIED']), error: '', success: '' });
        }
        this.setState({ loading: false });
      }).catch((err) => {
        this.setState({ loading: false, error: getToast(err) });
      });
    } catch (err) {
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  onSubmitSendText = () => {
    this.setState({ loadingSendText: true });
    const { verifyPhoneNumber } = this.props;
    const { phoneNumber, phoneVerificationCode } = this.state.user;

    try {
      verifyPhoneNumber(phoneNumber, phoneVerificationCode).then(({ data }) => {
        this.setState({ loadingSendText: false, phoneVerified: data.verifyPhoneNumber.User.phoneVerified, success: getToast(['PHONE_NUMBER_VERIFIED']), error: '', warning: '' });
      }).catch((err) => {
        this.setState({ loadingSendText: false, error: getToast(err) });
      });
    } catch (err) {
      this.setState({ loadingSendText: false, error: getToast(err) });
    }
  }

  renderSendTextButton = () => {
    if (this.state.loadingSendText) {
      return (<Loading />);
    }

    const { phoneVerified } = this.state;

    return (
      !phoneVerified && (<CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => this.onSubmitSendText()}
        disabled={phoneVerified}
      >
        Send Text
      </CustomButton>)
    );
  }

  renderButton = () => {
    if (this.state.loading) {
      return (<Loading />);
    }

    return (
      <CustomButton
        style={styles.button}
        bgColor={Colors.background.green}
        onPress={() => this.onSubmit()}
      >
        Check Verification
      </CustomButton>
    );
  }

  render() {
    const { user, error, warning, success } = this.state;

    return (
      <Container>
        <Image source={{ uri: user.avatar }} style={styles.profilePic} />
        <GreetText>Great {user.firstName}!</GreetText>
        <ColoredText color={Colors.text.blue}>You are almost done!</ColoredText>
        <ColoredText color={Colors.text.purple}>
          All you need to do now is to confirm you cellphone number!
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          You will confirm by sending a text message with your unique code
          from the phone your are seeing this on right now - to our number.
        </ColoredText>
        <ColoredText color={Colors.text.blue}>Your code:</ColoredText>
        <Text style={styles.code}>{user.phoneVerificationCode}</Text>
        <ColoredText color={Colors.text.green}>
          The text message cost the same as an ordinary text message with
          you service provider.
        </ColoredText>
        <Toast message={error} type="error" />
        <Toast message={warning} type="warning" />
        <Toast message={success} type="success" />
        {this.renderSendTextButton()}
        {this.renderButton()}
        <Text style={styles.promise} > We will never give your number to any third parties.</Text>
      </Container>
    );
  }
}

SendText.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  isPhoneVerified: PropTypes.func.isRequired,
  verifyPhoneNumber: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
});

export default compose(withPhoneVerified, withVerifyPhoneNumber,
  connect(null, mapDispatchToProps))(SendText);
