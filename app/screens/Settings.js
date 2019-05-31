import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { Wrapper } from '@components/common';
import actionSheetMenu from '@components/common/actionSheetMenu';
import { Colors } from '@theme';
import { trans } from '@lang/i18n';
import ToolBar from '@components/utils/toolbar';
import { AppText } from '@components/utils/texts';
import LangService from '@services/lang';
import I18n from 'react-native-i18n';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withUpdateProfile } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    lineHeight: 28,
  },
});

const AvailableLanguages = {
  en: 'English',
  'en-GB': 'English',
  'en-US': 'English',
  'en-AU': 'English',
  'en-CA': 'English',
  'en-NZ': 'English',
  'en-SG': 'English',
  'en-IN': 'English',
  'en-IE': 'English',
  'en-ZA': 'English',
  'en-NP': 'English',
  se: 'Swedish',
  sv: 'Swedish',
  'sv-SE': 'Swedish',
  'sv-NP': 'Swedish',
};

class Settings extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      language: 'en',
      notification: true,
      emailNotification: false,
    };
  }

  componentWillMount() {
    const { user: { notification, emailNotification } } = this.props;
    LangService.getLanguage().then((language) => {
      this.setState({ language: language || I18n.locale });
    });

    this.setState({ notification, emailNotification });
  }

  setNotificationStatus = (index) => {
    const { updateProfile, setUser, user } = this.props;

    if (index === 0 && !this.state.notification) {
      this.NotificationActionSheet.hide();
      this.setState({ notification: true }, () => {
        updateProfile({ notification: true }).then(() => {
          setUser({ user: { ...user, ...{ notification: true } } });
        });
      });
    } else if (index === 1 && this.state.notification) {
      this.NotificationActionSheet.hide();
      this.setState({ notification: false }, () => {
        updateProfile({ notification: false }).then(() => {
          setUser({ user: { ...user, ...{ notification: false } } });
        });
      });
    }
  }

  setEmailNotificationStatus = (index) => {
    const { updateProfile, setUser, user } = this.props;

    if (index === 0 && !this.state.emailNotification) {
      this.EmailNotificationActionSheet.hide();
      this.setState({ emailNotification: true }, () => {
        updateProfile({ emailNotification: true }).then(() => {
          setUser({ user: { ...user, ...{ emailNotification: true } } });
        });
      });
    } else if (index === 1 && this.state.emailNotification) {
      this.EmailNotificationActionSheet.hide();
      this.setState({ emailNotification: false }, () => {
        updateProfile({ emailNotification: false }).then(() => {
          setUser({ user: { ...user, ...{ emailNotification: false } } });
        });
      });
    }
  }

  setLanguage = (index) => {
    let language = '';
    if (index === 0) {
      language = 'en';
    } else if (index === 1) {
      language = 'sv';
    }

    if (language === '' || language === this.state.language) return;

    const { navigation } = this.props;

    this.setState({ language });
    this.LanguageActionSheet.hide();
    LangService.setLanguage(language)
      .then(() => {
        I18n.locale = language;
        navigation.navigate('Tab');
      });
  }

  showLanguageActionSheet = () => {
    this.LanguageActionSheet.show();
  }

  showNotificationActionSheet = () => {
    this.NotificationActionSheet.show();
  }

  showEmailNotificationActionSheet = () => {
    this.EmailNotificationActionSheet.show();
  }

  renderNotification = () => {
    const { notification } = this.state;

    return (
      <View style={styles.row}>
        <View>
          <AppText style={styles.text}>
            {trans('profile.notification')} <AppText fontVariation="bold"> - {notification ? trans('profile.on') : trans('profile.off')}</AppText>
          </AppText>
          <AppText color={Colors.text.gray} style={styles.text}>Toggle notification</AppText>
        </View>
        <TouchableOpacity style={styles.action} onPress={this.showNotificationActionSheet}>
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
      </View >
    );
  }

  renderEmailNotification = () => {
    const { emailNotification } = this.state;

    return (
      <View style={styles.row}>
        <View>
          <AppText style={styles.text}>
            {trans('profile.email_notification')} <AppText fontVariation="bold"> - {emailNotification ? trans('profile.on') : trans('profile.off')}</AppText>
          </AppText>
          <AppText color={Colors.text.gray} style={styles.text}>Toggle notification</AppText>
        </View>
        <TouchableOpacity style={styles.action} onPress={this.showEmailNotificationActionSheet}>
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
      </View >
    );
  }

  renderLanguage = () => {
    const { language } = this.state;

    return (
      <View style={styles.row}>
        <AppText style={styles.text}>
          {trans('profile.language')} <AppText fontVariation="bold"> - {AvailableLanguages[language]}</AppText>
        </AppText>
        <TouchableOpacity style={styles.action} onPress={this.showLanguageActionSheet}>
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const optionNotification = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setNotificationStatus(0)}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('profile.on')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setNotificationStatus(1)}
        style={[actionSheetMenu.actionItem,
          { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('profile.off')}</Text>
      </TouchableOpacity>,
      trans('global.cancel'),
    ];
    const optionEmail = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setEmailNotificationStatus(0)}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('profile.on')}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setEmailNotificationStatus(1)}
        style={[actionSheetMenu.actionItem,
          { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
      >
        <Text style={actionSheetMenu.actionLabel}>{trans('profile.off')}</Text>
      </TouchableOpacity>,
      trans('global.cancel'),
    ];
    const optionLang = [
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setLanguage(0)}
        style={actionSheetMenu.actionItem}
      >
        <Text style={actionSheetMenu.actionLabel}>English</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => this.setLanguage(1)}
        style={[actionSheetMenu.actionItem,
          { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
      >
        <Text style={actionSheetMenu.actionLabel}>Swedish</Text>
      </TouchableOpacity>,
      trans('global.cancel'),
    ];
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ActionSheet
          ref={(sheet) => { this.LanguageActionSheet = sheet; }}
          title={trans('profile.choose_your_preferred_language')}
          options={['English', 'Swedish', 'Cancel']}
          cancelButtonIndex={2}
          onPress={(index) => { this.setLanguage(index); }}
        />
        <ActionSheet
          ref={(sheet) => { this.NotificationActionSheet = sheet; }}
          title={trans('profile.notification')}
          options={optionNotification}
          cancelButtonIndex={optionNotification.length - 1}
          onPress={() => { }}
          styles={actionSheetMenu}
        />
        <ActionSheet
          ref={(sheet) => { this.EmailNotificationActionSheet = sheet; }}
          title={trans('profile.email_notification')}
          options={optionEmail}
          cancelButtonIndex={optionEmail.length - 1}
          onPress={() => { }}
          styles={actionSheetMenu}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingBottom: 50 }}>
          {this.renderNotification()}
          {this.renderEmailNotification()}
          { this.renderLanguage() }
        </ScrollView>
      </Wrapper>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    notification: PropTypes.bool,
  }).isRequired,
  updateProfile: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: ({ user }) => { dispatch(AuthAction.user(user)); },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation,
  withUpdateProfile)(Settings);
