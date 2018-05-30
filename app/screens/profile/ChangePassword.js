import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ToolBar from '@components/utils/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { Wrapper, Loading } from '@components/common';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import { withChangePassword } from '@services/apollo/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { trans } from '@lang/i18n';

import RoundedButton from '@components/common/roundedButton';
import PasswordInput from '@components/common/passwordInput';

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
  input: {
    marginTop: 0,
    marginBottom: 30,
    backgroundColor: Colors.background.fullWhite,
  },
  button: {
    width: 200,
    marginVertical: 50,
  },
  lodingWrapper: {
    padding: 24,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
});
class ChangePassword extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: false, oldPassword: '', hideOldPassword: true, hideNewPassword: true, newPassword: '', confirmPassword: '', error: '', success: '', inputs: {} });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { changePassword } = this.props;
    const { oldPassword, newPassword } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        changePassword(oldPassword, newPassword).then(() => {
          this.setState({ oldPassword: '', newPassword: '', confirmPassword: '', loading: false, error: '', success: getToast(['PASSWORD_UPDATED']) });
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err), success: '' });
        });
      } catch (err) {
        this.setState({ loading: false, error: getToast(err), success: '' });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors), success: '' });
    }
  }

  focusNextField = (id) => {
    const { inputs } = this.state;

    inputs[id].focus();
  }

  checkValidation() {
    const errors = [];
    const { oldPassword, newPassword, confirmPassword } = this.state;

    if (oldPassword.length === 0) {
      errors.push('ENTER_OLD_PASSWORD');
    }

    if (newPassword.length === 0) {
      errors.push('ENTER_NEW_PASSWORD');
    } else if (newPassword.length < 5) {
      errors.push('PASSWORD_SHORT');
    }

    if (confirmPassword.length === 0) {
      errors.push('ENTER_CONFIRM_PASSWORD');
    }

    if (newPassword !== confirmPassword) {
      errors.push('PASSWORD_UNMATCH');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  showCurrentPassword = () => {
    const { hideOldPassword } = this.state;
    this.setState({ hideOldPassword: !hideOldPassword });
  }

  showNewPassword = () => {
    const { hideNewPassword } = this.state;
    this.setState({ hideNewPassword: !hideNewPassword });
  }

  secretIcon = (hide, text) => (
    <Icon
      name={hide ? 'ios-eye' : 'ios-eye-off'}
      size={32}
      style={text === '' ? styles.disabled : styles.showIcon}
    />
  );

  renderUpdateButton = () => {
    const { loading } = this.state;
    if (loading) {
      return (
        <View style={styles.lodingWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={styles.buttonWrapper}>
        <RoundedButton
          onPress={this.onSubmit}
          style={styles.button}
          bgColor={Colors.background.pink}
        >
          {trans('profile.change_password')}
        </RoundedButton>
      </View>
    );
  }

  render() {
    const {
      error,
      success,
      inputs,
      oldPassword,
      newPassword,
      confirmPassword,
    } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar title={trans('profile.change_password')} />
        <ScrollView>
          <View style={{ paddingTop: 50 }}>
            <Toast message={error} type="error" />
            <Toast message={success} type="success" />
            <Text style={styles.label}>{trans('profile.current_password')}</Text>
            <PasswordInput
              style={styles.input}
              value={oldPassword}
              onChangeText={text => this.setState({ oldPassword: text })}
              // onSubmitEditing={() => this.focusNextField('two')}
              ref={(input) => { inputs.one = input; }}
              // returnKeyType="next"
            />
            <Text style={styles.label}>{trans('profile.new_password')}</Text>
            <PasswordInput
              style={styles.input}
              value={newPassword}
              onChangeText={text => this.setState({ newPassword: text })}
              // onSubmitEditing={() => this.focusNextField('three')}
              ref={(input) => { inputs.two = input; }}
              // returnKeyType="next"
            />
            <Text style={styles.label}>{trans('profile.confirm_password')}</Text>
            <PasswordInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={text => this.setState({ confirmPassword: text })}
              // onSubmitEditing={() => this.focusNextField('three')}
              ref={(input) => { inputs.three = input; }}
              returnKeyType="send"
            />
            {this.renderUpdateButton()}
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

ChangePassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  changePassword: PropTypes.func.isRequired,
};

export default withChangePassword(ChangePassword);
