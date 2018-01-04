import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import Colors from '@theme/colors';
import { Wrapper, NavBar, Loading } from '@components/common';
import PropTypes from 'prop-types';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import LangService from '@services/lang';
import { withContacts } from '@services/apollo/contact';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import { FBLoginManager } from 'react-native-facebook-login';
import LinkFacebook from '@components/facebook/link';
import I18n from 'react-native-i18n';
import { trans } from '@lang/i18n';

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
      languageChanged: 0,
    });
  }

  async componentWillMount() {
    const language = await LangService.getLanguage();
    this.setState({ language });
  }

  onEdit = () => {
    const { navigation } = this.props;
    navigation.navigate('EditProfile');
  }

  onChangePassword = () => {
    const { navigation } = this.props;
    navigation.navigate('ChangePassword');
  }

  setLanguage = (language) => {
    if (language === this.state.language) return;
    
    this.setState({ language });
    LangService.setLanguage(language).then(() => {
      I18n.locale = language;
      this.props.navigation.reset('Tab');
    });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  logout = () => {
    const { logout, navigation } = this.props;
    this.setState({ loading: true }, () => {
      logout()
        .then(() => navigation.reset('Splash'))
        .then(() => FBLoginManager.logout(() => { }));
    });
  }

  sync = () => {
    const { syncContacts } = this.props;
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.warn(err);
      } else {
        const mobiles = [];
        contacts.forEach(
          contact => contact.phoneNumbers.forEach(book => mobiles.push(book.number)),
        );
        syncContacts(mobiles)
          .then(() => {
            Alert.alert('Success!', 'Contact successully synced.');
          })
          .catch(error => console.warn(error));
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
              <Text>{trans('setting.change_password')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listWrapper}>
            <Text>Language</Text>
            <Picker
              selectedValue={this.state.language}
              onValueChange={language => this.setLanguage(language)}
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
    .catch(error => console.warn(error)),
});

export default compose(withContacts, connect(mapStateToProps, mapDispatchToProps))(Settings);
