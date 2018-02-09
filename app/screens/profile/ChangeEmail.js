import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import CustomButton from '@components/common/customButton';
import { Wrapper, FloatingNavbar, Loading } from '@components/common';
import { withChangeEmail } from '@services/apollo/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { getToast } from '@config/toast';
import Toast from '@components/toast';

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
    const { changeEmail, setUser } = this.props;
    const { newEmail } = this.state;

    try {
      changeEmail(newEmail).then(({ data }) => {
        setUser(data.changeEmail.User);
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
      <CustomButton
        bgColor={Colors.background.green}
        style={styles.button}
        onPress={this.onSubmit}
        disabled={!(newEmail.length > 0)}
      >
        Change Email
      </CustomButton>
    );
  }

  render() {
    const { newEmail, error, success } = this.state;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <FloatingNavbar handleBack={this.goBack} />
        <ScrollView style={{ paddingTop: 60 }}>
          <Toast message={error} type="error" />
          <Toast message={success} type="success" />
          <Text style={styles.label}>New Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={newEmail}
              style={styles.input}
              onChangeText={text => this.setState({ newEmail: text })}
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

ChangeEmail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  changeEmail: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
});

export default compose(withChangeEmail, connect(mapStateToProps, mapDispatchToProps))(ChangeEmail);
