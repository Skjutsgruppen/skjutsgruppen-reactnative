import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Picker } from 'react-native';
import { Wrapper } from '@components/common';
import { Colors } from '@theme';
import { trans } from '@lang/i18n';
import ToolBar from '@components/utils/toolbar';
import { AppText } from '@components/utils/texts';
import LangService from '@services/lang';
import I18n from 'react-native-i18n';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

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
  se: 'Swedish',
  'sv-SE': 'Swedish',
};

class Settings extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      language: 'en',
      notification: 'On',
    };
  }

  componentWillMount() {
    LangService.getLanguage().then((language) => {
      this.setState({ language: language || I18n.locale });
    });
  }

  setNotificationStatus = (notification) => {
    this.setState({ notification });
  }

  setLanguage = (language) => {
    if (language === this.state.language) return;

    const { navigation } = this.props;

    this.setState({ language });
    LangService.setLanguage(language)
      .then(() => {
        I18n.locale = language;
        navigation.navigate('Tab');
      });
  }

  renderNotification = () => {
    const { notification } = this.state;

    return (
      <View style={styles.row}>
        <View>
          <AppText style={styles.text}>
            Notification <AppText fontVariation="bold"> - {notification}</AppText>
          </AppText>
          <AppText color={Colors.text.gray} style={styles.text}>Toggle notification</AppText>
        </View>
        <TouchableOpacity style={styles.action}>
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
        <Picker
          selectedValue={notification}
          onValueChange={this.setNotificationStatus}
          style={{ width: '20%', height: '100%', opacity: 0, position: 'absolute', top: 36, right: 20, backgroundColor: 'red' }}
        >
          <Picker.Item label="On" value="On" />
          <Picker.Item label="Off" value="Off" />
        </Picker>
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
        <TouchableOpacity style={styles.action}>
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
        <Picker
          selectedValue={language}
          onValueChange={this.setLanguage}
          style={{ width: '20%', height: '100%', opacity: 0, position: 'absolute', top: 36, right: 20, backgroundColor: 'red' }}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Swedish" value="se" />
        </Picker>
      </View>
    );
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingBottom: 50 }}>
          {this.renderNotification()}
          {this.renderLanguage()}
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
};

export default withNavigation(Settings);
