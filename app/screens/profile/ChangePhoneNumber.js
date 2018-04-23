import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import CustomButton from '@components/common/customButton';
import { Wrapper, Loading } from '@components/common';
import { withChangePhoneNumber, withRegeneratePhoneVerification } from '@services/apollo/auth';
import Phone from '@components/phone';
import { getPhoneNumber, getCountryDialCode } from '@helpers/device';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import Colors from '@theme/colors';
import SendSMS from 'react-native-sms';
import { SMS_NUMBER } from '@config';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 54,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 24,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
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
      verifyPreviousNumber: false,
    };
  }

  componentWillMount() {
    this.setState({ countryCode: getCountryDialCode(), phone: getPhoneNumber() });
    const { navigation, phoneVerificationCode } = this.props;
    const { params } = navigation.state;

    if (params) {
      this.setState({ verifyPreviousNumber: params.verifyPreviousNumber, phoneVerificationCode });
    }
  }

  onSubmit = () => {
    this.setState({ loading: true, error: '' });
    const {
      changePhoneNumber,
      setUser,
      regeneratePhoneVerification,
      setPhoneVerificationCode,
    } = this.props;
    const { countryCode, phone } = this.state;

    try {
      changePhoneNumber(countryCode, phone).then(({ data }) => {
        const { changePhoneNumber: { User: { phoneNumber } } } = data;
        regeneratePhoneVerification(phoneNumber).then((verification) => {
          this.setState({ phoneVerificationCode: verification.data.regeneratePhoneVerification });
          setPhoneVerificationCode(verification.data.regeneratePhoneVerification).then(() => {
            this.setState({ loading: false, error: '' });
          }).catch((err) => {
            this.setState({ loading: false, error: getToast(err) });
          });
        });
        setUser(data.changePhoneNumber.User);
      }).catch((err) => {
        this.setState({ loading: false, error: getToast(err) });
      });
    } catch (err) {
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  onVerifyPhone = () => {
    const { phoneVerificationCode } = this.state;
    Clipboard.setString(phoneVerificationCode);

    SendSMS.send({
      body: phoneVerificationCode,
      recipients: [SMS_NUMBER],
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderUpdateButton = () => {
    const { loading, phone } = this.state;
    let disableUpdateButton = true;

    if (phone) {
      disableUpdateButton = !(phone.length > 0);
    }

    if (loading) {
      return (
        <View style={styles.lodingWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <CustomButton
        bgColor={Colors.background.green}
        style={styles.button}
        onPress={this.onSubmit}
        disabled={disableUpdateButton}
      >
        {trans('profile.change_phone_number')}
      </CustomButton>
    );
  }

  renderVerifyButton = () => (
    <CustomButton
      bgColor={Colors.background.green}
      style={styles.button}
      onPress={this.onVerifyPhone}
    >{trans('profile.send_sms')}</CustomButton>
  )

  renderVerificationCode = () => {
    const { phoneVerificationCode } = this.state;

    return (
      <View>
        <Text style={styles.verifyText}>Your verification code is:</Text>
        <Text style={styles.code}>{phoneVerificationCode}</Text>
        <Text style={styles.verifyText}>
          {trans('profile.text_message_cost_same_as_ordinary_text')}
        </Text>
        {this.renderVerifyButton()}
      </View>
    );
  }

  render() {
    const { countryCode, error, phoneVerificationCode, verifyPreviousNumber } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Toast message={error} type="error" />
          {(!phoneVerificationCode && !verifyPreviousNumber) &&
            <View style={{ marginTop: 50 }}>
              <Text style={styles.label}>{trans('profile.new_phone_number')}</Text>
              <View style={[styles.inputWrapper, styles.firstInputWrapper]}>
                <Phone
                  defaultCode={countryCode}
                  style={styles.input}
                  placeholder={trans('profile.your_mobile_number')}
                  onChange={
                    ({ code, number }) => this.setState({ countryCode: code, phone: number })
                  }
                />
              </View>
              {this.renderUpdateButton()}
            </View>
          }
          {(phoneVerificationCode || verifyPreviousNumber) && this.renderVerificationCode()}
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
  setUser: PropTypes.func.isRequired,
  changePhoneNumber: PropTypes.func.isRequired,
  regeneratePhoneVerification: PropTypes.func.isRequired,
  setPhoneVerificationCode: PropTypes.func.isRequired,
  phoneVerificationCode: PropTypes.string,
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
