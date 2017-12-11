import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import Colors from '@theme/colors';
import { Wrapper, NavBar, Loading } from '@components/common';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { NavigationActions } from 'react-navigation';
import { withContacts } from '@services/apollo/contact';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import { FBLoginManager } from 'react-native-facebook-login';
import LinkFacebook from '@components/facebook/link';

const styles = StyleSheet.create({
  listWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.gray,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
});

class Settings extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.secureText = true;
    this.state = ({
      error: '',
      language: 'en',
      loading: false,
    });
  }

  onEdit = () => {
    const { navigation } = this.props;
    navigation.navigate('EditProfile');
  }

  onChangePassword = () => {
    const { navigation } = this.props;
    navigation.navigate('ChangePassword');
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  logout = () => {
    const { logout } = this.props;
    this.setState({ loading: true }, () => {
      logout()
        .then(() => this.navigateTo('Splash'))
        .then(() => FBLoginManager.logout(() => { }));
    });
  }

  navigateTo = (routeName) => {
    const { navigation } = this.props;
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  sync = () => {
    const { syncContacts } = this.props;
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.error(err);
      } else {
        const mobiles = [];
        contacts.forEach(
          contact => contact.phoneNumbers.forEach(book => mobiles.push(book.number)),
        );
        syncContacts(mobiles)
          .then(() => {
            Alert.alert('Success!', 'Contact successully synced.');
          })
          .catch(error => console.error(error));
      }
    });
  }

  render() {
    const { user } = this.props;

    if (this.state.loading) {
      return (<Loading />);
    }

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
          <View style={styles.listWrapper}>
            <TouchableOpacity onPress={this.onEdit} style={styles.list}>
              <Text>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listWrapper}>
            <TouchableOpacity onPress={this.onChangePassword} style={styles.list}>
              <Text>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listWrapper}>
            <Text>Language</Text>
            <Picker
              selectedValue={this.state.language}
              onValueChange={language => this.setState({ language })}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Swedish" value="se" />
            </Picker>
          </View>
          <View style={styles.listWrapper}>
            <LinkFacebook user={user} />
          </View>
          <View style={styles.listWrapper}>
            <TouchableOpacity style={styles.list}>
              <Text>Twitter Connect</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listWrapper}>
            <TouchableOpacity onPress={this.sync} style={styles.list}>
              <Text>Sync Contacts</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listWrapper}>
            <TouchableOpacity onPress={this.logout} style={styles.list}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    );
  }
}

Settings.propTypes = {
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  syncContacts: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.error(error)),
});

export default compose(withContacts, connect(mapStateToProps, mapDispatchToProps))(Settings);
