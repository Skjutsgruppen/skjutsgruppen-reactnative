import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import ToolBar from '@components/utils/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { Wrapper, Loading } from '@components/common';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import { withChangePassword } from '@services/apollo/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';

const styles = StyleSheet.create({
  profilePic: {
    height: 80,
    width: 80,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 40,
    margin: 24,
  },
  greet: {
    fontSize: 16,
  },
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
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
  iconWrapper: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    margin: 24,
  },
  lodingWrapper: {
    padding: 24,
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
      <CustomButton
        bgColor={Colors.background.green}
        style={styles.button}
        onPress={this.onSubmit}
      >
        Change Password
      </CustomButton>
    );
  }

  render() {
    const {
      error,
      success,
      inputs,
      oldPassword,
      hideOldPassword,
      newPassword,
      hideNewPassword,
      confirmPassword,
    } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView>
          <View style={{ paddingTop: 50 }}>
            <Toast message={error} type="error" />
            <Toast message={success} type="success" />
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={oldPassword}
                secureTextEntry={hideOldPassword}
                style={styles.input}
                onChangeText={text => this.setState({ oldPassword: text })}
                placeholderTextColor="#ccc"
                underlineColorAndroid="transparent"
                onSubmitEditing={() => this.focusNextField('two')}
                ref={(input) => { inputs.one = input; }}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={this.showCurrentPassword}
                disabled={oldPassword.length < 1}
              >
                <View style={styles.iconWrapper}>
                  {this.secretIcon(hideOldPassword, oldPassword)}
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={newPassword}
                secureTextEntry={hideNewPassword}
                style={styles.input}
                onChangeText={text => this.setState({ newPassword: text })}
                placeholderTextColor="#ccc"
                underlineColorAndroid="transparent"
                onSubmitEditing={() => this.focusNextField('three')}
                ref={(input) => { inputs.two = input; }}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={this.showNewPassword}
                disabled={newPassword.length < 1}
              >
                <View style={styles.iconWrapper}>
                  {this.secretIcon(hideNewPassword, newPassword)}
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={confirmPassword}
                secureTextEntry
                style={styles.input}
                onChangeText={text => this.setState({ confirmPassword: text })}
                placeholderTextColor="#ccc"
                underlineColorAndroid="transparent"
                onSubmitEditing={this.onSubmit}
                ref={(input) => { inputs.three = input; }}
                returnKeyType="send"
              />
            </View>
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
