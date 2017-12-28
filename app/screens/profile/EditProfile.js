import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, Image } from 'react-native';
import { Wrapper, Loading, NavBar } from '@components/common';
import Camera from '@components/camera';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';
import { compose } from 'react-apollo';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { withUpdateProfile } from '@services/apollo/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getToast } from '@config/toast';
import Toast from '@components/new/toast';

const styles = StyleSheet.create({
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  profilePicLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.blue,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
  input: {
    height: 48,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 24,
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
});

class EditProfile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ firstName: '', lastName: '', avatar: '', profileImage: null, loading: false, error: '', success: '' });
  }

  componentWillMount() {
    const { firstName, lastName, avatar } = this.props.user;

    this.setState({ firstName, lastName, profileImage: avatar });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { updateProfile, setUser } = this.props;
    const { firstName, lastName, avatar } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        updateProfile({ firstName, lastName, avatar }).then((res) => {
          setUser(res.data.updateUser.User);
          this.setState({ loading: false, error: '', success: getToast(['PROFILE_UPDATED']) });
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

  checkValidation() {
    const errors = [];
    const { firstName, lastName } = this.state;

    if (firstName === '') {
      errors.push('FIRST_NAME_REQUIRED');
    }

    if (lastName === '') {
      errors.push('LAST_NAME_REQUIRED');
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

  renderUpdateButton = () => {
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }

    return (
      <CustomButton
        bgColor={Colors.background.darkCyan}
        style={styles.button}
        onPress={this.onSubmit}
      >
        Update
      </CustomButton>
    );
  }


  render() {
    const { profileImage, success, error } = this.state;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <ScrollView>
          <Camera onSelect={res => this.setState({ avatar: res.data })}>
            <View>
              <Image source={{ uri: profileImage }} style={styles.profilePicture} />
              <Text style={styles.profilePicLabel}>Update Profile Picture</Text>
            </View>
          </Camera>
          <Toast message={error} type="error" />
          <Toast message={success} type="success" />
          <Text style={styles.label}>First name</Text>
          <TextInput
            onChangeText={firstName => this.setState({ firstName })}
            style={styles.input}
            placeholder="Your first name"
            value={this.state.firstName}
            autoCorrect={false}
            returnKeyType={'done'}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
          />
          <Text style={styles.label}>Last name</Text>
          <TextInput
            onChangeText={lastName => this.setState({ lastName })}
            style={styles.input}
            placeholder="Your last name"
            value={this.state.lastName}
            autoCorrect={false}
            returnKeyType={'done'}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
          />
          {this.renderUpdateButton()}
        </ScrollView>
      </Wrapper>
    );
  }
}

EditProfile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.warn(error)),
});

export default compose(withUpdateProfile,
  connect(mapStateToProps, mapDispatchToProps))(EditProfile);
