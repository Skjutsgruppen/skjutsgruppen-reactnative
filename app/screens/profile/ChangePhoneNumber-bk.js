import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, Clipboard, PermissionsAndroid, Platform, Alert } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { Wrapper } from '@components/common';
import { withChangePhoneNumber, withRegeneratePhoneVerification } from '@services/apollo/auth';
import { getPhoneNumber, getCountryDialCode } from '@helpers/device';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import Toast from '@components/toast';
import Colors from '@theme/colors';
import SendSMS from 'react-native-sms';
import { SMS_NUMBER } from '@config';
import { trans } from '@lang/i18n';
import CustomButton from '../../components/common/customButton';

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 54,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 24,
    fontSize: 14,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
  button: {
    margin: 24,
  },
  lodingWrapper: {
    padding: 24,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 24,
  },
  verifyText: {
    textAlign: 'center',
    color: Colors.text.green,
  },
});

class ChangePhoneNumber extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      countryCode: '',
      phone: '',
      error: '',
      phoneVerificationCode: null,
    };
  }

  async componentWillMount() {
    this.setState({ countryCode: getCountryDialCode(), phone: getPhoneNumber() });
    const {
      user,
      regeneratePhoneVerification,
      setPhoneVerificationCode,
      phoneVerificationCode,
    } = this.props;

    if (!phoneVerificationCode) {
      this.setState({ loading: true });
      const verificationCode = await regeneratePhoneVerification(null, user.email);

      await setPhoneVerificationCode(verificationCode.data.regeneratePhoneVerification);

      this.setState({
        code: verificationCode.data.regeneratePhoneVerification,
        loading: false,
      });
    } else {
      this.setState({
        code: phoneVerificationCode,
      });
    }
  }

  onVerifyPhone = async () => {
    if (Platform.OS === 'android') {
      const permission = await PermissionsAndroid
        .check(PermissionsAndroid.PERMISSIONS.READ_SMS);

      if (!permission) {
        const status = await PermissionsAndroid
          .request(PermissionsAndroid.PERMISSIONS.READ_SMS);

        if (status === 'granted') {
          this.sendSMS();
        } else {
          Alert.alert(trans('share.allow_sms_permission'));
        }
      } else {
        this.sendSMS();
      }
    } else {
      this.sendSMS();
    }
  }

  sendSMS = () => {
    const { code } = this.state;
    Clipboard.setString(code);

    SendSMS.send({
      body: code,
      recipients: [SMS_NUMBER],
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderVerifyButton = () => (
    <CustomButton
      bgColor={Colors.background.green}
      style={styles.button}
      onPress={this.onVerifyPhone}
    >
      {trans('profile.send_sms')}
    </CustomButton>
  );

  renderVerificationCode = () => {
    const { code } = this.state;

    return (
      <View>
        <Text s={styles.verifyText}>{trans('profile.please_send_the_following_code')}</Text>
        <Text style={styles.code}>{code}</Text>
        <Text style={styles.verifyText}>
          {trans('profile.text_message_cost_same_as_ordinary_text')}
        </Text>
        {this.renderVerifyButton()}
      </View>
    );
  }

  render() {
    const { error } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Toast message={error} type="error" />
          {this.renderVerificationCode()}
        </ScrollView>
      </Wrapper>
    );
  }
}

ChangePhoneNumber.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        verifyPreviousNumber: PropTypes.bool,
      }),
    }).isRequired,
  }).isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
};

ChangePhoneNumber.defaultProps = {
  phoneVerificationCode: null,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  phoneVerificationCode: state.auth.phoneVerification,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
  setPhoneVerificationCode: code => AuthService.setPhoneVerification(code)
    .then(() => dispatch(AuthAction.phoneVerification(code)))
    .catch(error => console.warn(error)),
});

export default compose(
  withChangePhoneNumber,
  withRegeneratePhoneVerification,
  connect(mapStateToProps,
    mapDispatchToProps,
  ))(ChangePhoneNumber);
