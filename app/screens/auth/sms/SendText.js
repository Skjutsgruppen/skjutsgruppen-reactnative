import React, { Component } from 'react';
import { Text, StyleSheet, Image, Alert } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { CustomButton, Loading } from '@components/common';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withPhoneVerified } from '@services/apollo/profile';

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
    this.state = ({ loading: false, error: '', user: {}, token: null });
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
            navigation.navigate('MobileVerified');
          }).catch((err) => {
            Alert.alert('Error!', err.message);
          });
        } else {
          Alert.alert('Warning!', 'Phone number not verified!');
        }
        this.setState({ loading: false });
      }).catch((err) => {
        Alert.alert('Error!', err.message);
        this.setState({ loading: false });
      });
    } catch (err) {
      Alert.alert('Error!', err.message);
      this.setState({ loading: false });
    }
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
    const { user } = this.state;

    return (
      <Container>
        <Image source={{ uri: user.photo }} style={styles.profilePic} />
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
        {this.renderButton()}
        <Text style={styles.promise}>We will never give your number to any third parties.</Text>
      </Container>
    );
  }
}

SendText.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  isPhoneVerified: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token }))),
});

export default compose(withPhoneVerified, connect(null, mapDispatchToProps))(SendText);
