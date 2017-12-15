import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid as Toast, Modal, TouchableWithoutFeedback } from 'react-native';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import TabIcon from '@components/tabIcon';
import { Wrapper } from '@components/common';
import { compose } from 'react-apollo';
import { withContacts } from '@services/apollo/contact';
import Contacts from 'react-native-contacts';
import Colors from '@theme/colors';
import BackButton from '@components/common/backButton';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';
import CustomButton from '@components/common/customButton';
import PopupMenu from '@components/profile/popupMenu';

const Profile = withProfile(ProfileDetail);

const styles = StyleSheet.create({
  navbar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  section: {
    paddingVertical: 32,
  },
  button: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: 160,
  },
  menuText: {
    width: 160,
    color: Colors.text.darkGray,
    backgroundColor: 'transparent',
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
    this.state = ({
      error: '',
      modalVisibility: false,
    });
  }

  onEdit = () => {
    this.setModalVisibility(false);
    const { navigation } = this.props;
    navigation.navigate('EditProfile');
  }

  onChangePassword = () => {
    this.setModalVisibility(false);
    const { navigation } = this.props;
    navigation.navigate('ChangePassword');
  }

  setModalVisibility = ((visibility) => {
    this.setState({
      modalVisibility: visibility,
    });
  })

  navigateTo = (routeName) => {
    const { navigation } = this.props;
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName })],
    });
    navigation.dispatch(resetAction);
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  logout = () => {
    const { logout } = this.props;
    logout().then(() => {
      this.navigateTo('Splash');
    });
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
            Toast.show('Contact successully synced.', Toast.LONG);
          })
          .catch(error => console.error(error));
      }
    });
  }

  render() {
    const { navigation } = this.props;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.navbar}>
          <BackButton onPress={this.goBack} >Back</BackButton>
          <TouchableOpacity
            navigation={navigation}
            onPress={() => this.setModalVisibility(true)}
          >
            <Icon
              name="ios-options"
              size={18}
              color="#777"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
          <ScrollView>
            <Profile
              navigation={navigation}
              id={this.props.user.id}
            />
            <View style={styles.section}>
              <CustomButton
                bgColor={Colors.background.darkCyan}
                style={styles.button}
                onPress={this.logout}
              >
                Logout
              </CustomButton>
              <CustomButton
                bgColor={Colors.background.darkCyan}
                style={styles.button}
                onPress={this.sync}
              >
                Sync Contacts
              </CustomButton>
            </View>
          </ScrollView>
        </View>
        <Modal
          transparent
          visible={this.state.modalVisibility}
          onShow={this.showDropDownMenu}
          onDismiss={this.hideDropDownMenu}
          onRequestClose={() => { this.visibleModal(false); }}
        >
          <TouchableWithoutFeedback onPress={() => this.setModalVisibility(false)}>
            <View style={{ flex: 1 }}>
              <PopupMenu>
                <TouchableOpacity
                  onPress={this.onEdit}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onChangePassword}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>Change password</Text>
                </TouchableOpacity>
              </PopupMenu>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Wrapper>
    );
  }
}

Support.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  syncContacts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.error(error)),
});

export default compose(withContacts,
  connect(mapStateToProps, mapDispatchToProps))(Support);
