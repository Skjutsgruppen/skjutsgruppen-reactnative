import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import CustomButton from '@components/common/customButton';
import { ColoredText, GreetText } from '@components/auth/texts';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';

const styles = StyleSheet.create({
  profilePic: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 40,
    marginBottom: 24,
  },
  button: {
    margin: 24,
  },
});

class MobileVerified extends Component {
  static navigationOptions = {
    header: null,
  };

  onEnter = () => {
    const { navigation } = this.props;
    navigation.navigate('Tab');
  }

  render() {
    const { auth: { user } } = this.props;

    return (
      <Container>
        <Image source={{ uri: user.photo }} style={styles.profilePic} />
        <GreetText>Your number is confirmed!</GreetText>
        <ColoredText color={Colors.text.blue}>Welcome {user.firstName}!</ColoredText>
        <ColoredText color={Colors.text.purple}>
          You are now part of the non-profit ridesharing movement Skjutsgruppen!
        </ColoredText>
        <ColoredText color={Colors.text.green}>
          We are looking forward to rideshare with you!
        </ColoredText>
        <ColoredText color={Colors.text.purple}>
          Press enter to start looking arround and say hi to other participants
        </ColoredText>
        <CustomButton
          style={styles.button}
          onPress={this.onEnter}
          bgColor={Colors.background.green}
        >
          Enter
        </CustomButton>
      </Container>
    );
  }
}

MobileVerified.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  auth: PropTypes.shape({
    login: PropTypes.bool,
    token: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneNumber: PropTypes.string,
      photo: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.error(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileVerified);
