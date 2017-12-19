import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Wrapper, Loading, NavBar } from '@components/common';
import { GreetText, ColoredText } from '@components/auth/texts';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withChangePassword } from '@services/apollo/auth';

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
    this.state = ({ loading: false, oldPassword: '', hideOldPassword: true, hideNewPassword: true, newPassword: '', confirmPassword: '', error: '' });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { changePassword } = this.props;
    const { oldPassword, newPassword } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        changePassword(oldPassword, newPassword).then(() => {
          Alert.alert('Success!', 'Password successfully updated.');
          this.setState({ oldPassword: '', newPassword: '', confirmPassword: '', loading: false, error: '' });
        }).catch((err) => {
          Alert.alert('Error!', err.message);
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        Alert.alert('Error!', err.message);
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Alert.alert('Error!', validation.errors.join('\n'));
      this.setState({ loading: false });
    }
  }

  checkValidation() {
    const errors = [];
    const { oldPassword, newPassword, confirmPassword } = this.state;

    if (oldPassword.length === 0) {
      errors.push('Please enter old password.');
    }

    if (newPassword.length === 0) {
      errors.push('Please enter new password.');
    } else if (newPassword.length < 5) {
      errors.push('New password too short, should be atleast 5 characters.');
    }

    if (confirmPassword.length === 0) {
      errors.push('Please enter confirm password.');
    }

    if (newPassword !== confirmPassword) {
      errors.push('New passwords do not match.');
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
    const { auth: { user } } = this.props;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <ScrollView>
          <Image source={{ uri: user.photo }} style={styles.profilePic} />
          <GreetText color={Colors.text.green}>
            Hi again {user.firstName}!
          </GreetText>
          <ColoredText color={Colors.text.blue}>Change your password here:</ColoredText>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={this.state.oldPassword}
              secureTextEntry={this.state.hideOldPassword}
              style={styles.input}
              onChangeText={oldPassword => this.setState({ oldPassword })}
              placeholderTextColor="#ccc"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={this.showCurrentPassword}
              disabled={this.state.oldPassword.length < 1}
            >
              <View style={styles.iconWrapper}>
                {
                  this.state.hideOldPassword ? (
                    <Icon
                      name="ios-eye"
                      size={32}
                      style={this.state.oldPassword === '' ? styles.disabled : []}
                    />
                  ) : (
                    <Icon
                      name="ios-eye-off"
                      size={32}
                      style={styles.showIcon}
                    />
                  )
                }
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={this.state.newPassword}
              secureTextEntry={this.state.hideNewPassword}
              style={styles.input}
              onChangeText={newPassword => this.setState({ newPassword })}
              placeholderTextColor="#ccc"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={this.showNewPassword}
              disabled={this.state.newPassword.length < 1}
            >
              <View style={styles.iconWrapper}>
                {
                  this.state.hideNewPassword ? (
                    <Icon
                      name="ios-eye"
                      size={32}
                      style={this.state.newPassword === '' ? styles.disabled : []}
                    />
                  ) : (
                    <Icon
                      name="ios-eye-off"
                      size={32}
                      style={styles.showIcon}
                    />
                  )
                }
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={this.state.confirmPassword}
              secureTextEntry
              style={styles.input}
              onChangeText={confirmPassword => this.setState({ confirmPassword })}
              placeholderTextColor="#ccc"
              underlineColorAndroid="transparent"
            />
          </View>
          {this.renderUpdateButton()}
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
  auth: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      photo: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(withChangePassword, connect(mapStateToProps))(ChangePassword);
