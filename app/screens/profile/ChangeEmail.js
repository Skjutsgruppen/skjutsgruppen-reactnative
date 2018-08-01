import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { Colors } from '@theme';
import { Wrapper, Loading, RoundedButton } from '@components/common';
import { withChangeEmail } from '@services/apollo/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  input: {
    // flex: 1,
    // height: 54,
    // backgroundColor: Colors.background.fullWhite,
    // paddingHorizontal: 24,
    // fontSize: 14,
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 80,
    marginTop: 12,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.fullWhite,
  },
  label: {
    paddingHorizontal: 24,
    color: Colors.text.gray,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    marginHorizontal: 24,
    marginVertical: 32,
  },
  lodingWrapper: {
    padding: 24,
  },
});

class ChangeEmail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, newEmail: '', error: '', success: '' };
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { changeEmail } = this.props;
    const { newEmail } = this.state;

    try {
      changeEmail(newEmail).then(() => {
        // const { User, token } = data.changeEmail;
        // if (User && token) {
        //   setLogin({
        //     token: data.isPhoneVerified.token,
        //     user: User,
        //   });
        // }
        // setUser(data.changeEmail.User);
        this.setState({ loading: false, error: '', newEmail: '', success: getToast(['EMAIL_SUCCESSFULLY_CHANGED']) });
      }).catch((err) => {
        this.setState({ loading: false, error: getToast(err), success: '' });
      });
    } catch (err) {
      this.setState({ loading: false, error: getToast(err), success: '' });
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderUpdateButton = () => {
    const { loading, newEmail } = this.state;

    if (loading) {
      return (
        <View style={styles.lodingWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      // <CustomButton
      //   bgColor={Colors.background.green}
      //   style={styles.button}
      //   onPress={this.onSubmit}
      //   disabled={!(newEmail.length > 0)}
      // >
      //   {trans('profile.change_email')}
      // </CustomButton>
      <RoundedButton
        bgColor={Colors.background.pink}
        style={styles.button}
        onPress={this.onSubmit}
        disabled={!(newEmail.length > 0)}
      >
        {trans('profile.change_email')}
      </RoundedButton>
    );
  }

  render() {
    const { newEmail, error, success } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView>
          <View style={{ paddingTop: 60 }}>
            <Toast message={error} type="error" />
            <Toast message={success} type="success" />
            <Text style={styles.label}>{trans('profile.new_email')}</Text>
            <TextInput
              autoFocus
              autoCapitalize="none"
              allowFontScaling={false}
              value={newEmail}
              placeholder={trans('profile.email')}
              style={styles.input}
              onChangeText={text => this.setState({ newEmail: text })}
              onSubmitEditing={this.onSubmit}
              placeholderTextColor="#ccc"
              underlineColorAndroid="transparent"
              returnKeyLabel="Change"
            />
          </View>
          {this.renderUpdateButton()}
        </ScrollView>
      </Wrapper>
    );
  }
}

ChangeEmail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  changeEmail: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
});

export default compose(withChangeEmail, connect(mapStateToProps, mapDispatchToProps))(ChangeEmail);
