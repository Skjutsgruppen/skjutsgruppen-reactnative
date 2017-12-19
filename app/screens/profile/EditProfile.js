import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, Image, Alert } from 'react-native';
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
    this.state = ({ firstName: '', lastName: '', photo: '', profileImage: null, loading: false, error: '' });
  }

  componentWillMount() {
    const { firstName, lastName, photo } = this.props.user;

    this.setState({ firstName, lastName, profileImage: photo });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { updateProfile, setUser } = this.props;
    const { firstName, lastName, photo } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        updateProfile({ firstName, lastName, photo }).then((res) => {
          setUser(res.data.updateUser.User);
          this.setState({ loading: false, error: '' });
          Alert.alert('Success!', 'Profile successfully updated.');
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Alert.alert('Error!', validation.errors.join('\n'));
      this.setState({ loading: false });
    }
  }

  checkValidation() {
    const errors = [];
    const { firstName, lastName } = this.state;

    if (firstName === '') {
      errors.push('First Name is required.');
    }

    if (lastName === '') {
      errors.push('Last Name is required.');
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
    const { profileImage } = this.state;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <ScrollView>
          <Camera onSelect={res => this.setState({ photo: res.data })}>
            <View>
              <Image source={{ uri: profileImage }} style={styles.profilePicture} />
              <Text style={styles.profilePicLabel}>Update Profile Picture</Text>
            </View>
          </Camera>
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
    photo: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.error(error)),
  setUser: user => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.user(user)))
    .catch(error => console.error(error)),
});

export default compose(withUpdateProfile,
  connect(mapStateToProps, mapDispatchToProps))(EditProfile);
