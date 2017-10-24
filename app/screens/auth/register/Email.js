import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ToastAndroid as Toast } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import BackButton from '@components/auth/backButton';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import { userRegister } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  garderIcon: {
    marginBottom: 50,
    resizeMode: 'cover',
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 32,
  },
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
});

class Email extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ email: 'manish.singh+@yipl.com.np', loading: false, error: '' });
  }

  componentWillMount() {
    const { auth } = this.props;
    if (auth.login) {
      this.navigateTo('Tab');
    }
  }

  onPressBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onSubmit = () => {
    this.setState({ loading: true });
    const { register, setRegister, navigation } = this.props;
    const { email } = this.state;

    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        register(email).then(({ data }) => {
          const { token, User } = data.register;
          setRegister({ token, user: User }).then(() => {
            this.setState({ loading: false }, () => {
              navigation.navigate('CheckMail');
            });
          });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Toast.show(validation.errors.join('\n'), Toast.LONG);
      this.setState({ loading: false });
    }
  }

  navigateTo = (routeName) => {
    const { navigation } = this.props;
    navigation.navigate(routeName);
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  checkValidation() {
    const errors = [];
    const { email } = this.state;

    if (email === '') {
      errors.push('Email is required.');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <CustomButton
        bgColor={Colors.background.green}
        onPress={this.onSubmit}
      >
        Next
      </CustomButton>
    );
  }

  render() {
    const { error } = this.state;

    return (
      <Container>
        <Image source={require('@icons/icon_garden.png')} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>Become a participant</GreetText>
        <ColoredText color={Colors.text.purple}>Confirm your e-mail</ColoredText>
        {(error !== '') ? (<View><Text>{error}</Text></View>) : null}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.email}
            onChangeText={email => this.setState({ email })}
            placeholder="Fill in your e-mail"
            underlineColorAndroid="transparent"
          />
        </View>
        {this.renderButton()}
        <View style={styles.divider} />
        <ColoredText color={Colors.text.purple}>
          Or sign up with Facebook or Twitter instead
        </ColoredText>
        <CustomButton onPress={() => { }} bgColor="#3b5998">Sign Up with Facebook</CustomButton>
        <CustomButton onPress={() => { }} bgColor="#1da1f2">Sign Up with Twitter</CustomButton>
        <BackButton onPress={this.onPressBack} />
      </Container>
    );
  }
}


Email.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
    login: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  setRegister: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  setRegister: user => AuthService.set(user)
    .then(() => dispatch(AuthAction.register(user))),
});

export default compose(userRegister, connect(mapStateToProps, mapDispatchToProps))(Email);
