import React, { Component } from 'react';
import { Image, View, TextInput, Text, StyleSheet, Button, ToastAndroid as Toast } from 'react-native';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import TabIcon from '@components/tabIcon';
import { Loading, Wrapper } from '@components/common';
import { compose } from 'react-apollo';
import { withUpdateProfile } from '@services/apollo/auth';
import Camera from '@components/camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ddd',
    width: 300,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#222',
  },
  inputWrapper: {
    height: 70,
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
  },
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
    marginBottom: 24,
  },
  addPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 100,
  },
});


class Support extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Support',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-settings-outline"
        iconFocused="ios-settings"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.secureText = true;
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
        updateProfile(firstName, lastName, photo).then((res) => {
          setUser(res.data.updateUser);
          this.setState({ loading: false, error: '' });
          Toast.show('Profile successfully updated.', Toast.LONG);
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

  logout = () => {
    const { logout } = this.props;
    logout().then(() => {
      this.navigateTo('Splash');
    });
  }

  navigateTo = (routeName) => {
    const { navigation } = this.props;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  renderButton = () => {
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }

    return (<Button
      onPress={this.onSubmit}
      title="Update"
    />);
  }

  render() {
    const { error, profileImage } = this.state;

    let profile = null;
    if (profileImage) {
      profile = (<Image source={{ uri: profileImage }} style={styles.image} />);
    }

    return (
      <Wrapper>
        <View style={styles.container}>
          <Text style={styles.title} >Update Profile</Text>
          {(error !== '') && (<View style={styles.inputWrapper}><Text>{error}</Text></View>)}

          <View style={styles.addPhoto}>
            <Camera onSelect={res => this.setState({ photo: res.data })}>
              <View>
                {profile}
                <Text style={styles.addPhotoLabel}>update Profile Picture</Text>
              </View>
            </Camera>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={firstName => this.setState({ firstName })}
              style={styles.input}
              value={this.state.firstName}
              placeholder={'First Name'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={lastName => this.setState({ lastName })}
              value={this.state.lastName}
              style={styles.input}
              placeholder={'Last Name'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <View style={styles.inputWrapper}>
          {this.renderButton()}
        </View>

        <Button
          title="logout"
          onPress={this.logout}
        />
      </Wrapper>
    );
  }
}

Support.propTypes = {
  logout: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
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

export default compose(withUpdateProfile, connect(mapStateToProps, mapDispatchToProps))(Support);
