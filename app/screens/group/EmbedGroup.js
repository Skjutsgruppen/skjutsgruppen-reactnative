import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Platform, BackHandler } from 'react-native';
import { AppNotification, RoundedButton, Loading } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import { Colors } from '@theme';
import { OPEN_GROUP } from '@config/constant';
import { Heading, AppText } from '@components/utils/texts';
import EmbedMobile from '@assets/icons/embed_mobile.png';
import EmbedWeb from '@assets/icons/embed_web.png';
import { trans } from '@lang/i18n';
import PropTypes from 'prop-types';
import { withEmbed } from '@services/apollo/share';
import { compose } from 'react-apollo';
import SuccessIcon from '@assets/icons/ic_checked_green.png';
import ErrorIcon from '@assets/icons/ic_warning.png';

const styles = StyleSheet.create({
  mainTitle: {
    marginTop: 45,
    textAlign: 'center',
  },
  embedContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  embedImages: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 38,
  },
  embedContentWrapper: {
    maxWidth: 374,
  },
  openGroup: {
    paddingHorizontal: 55,
  },
  closeGroup: {
    maxWidth: 360,
  },
  buttonWrapper: {
    marginHorizontal: 24,
    marginTop: 48,
    marginBottom: 36,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  embedDescription: {
    lineHeight: 30,
  },
  button: {
    alignSelf: 'center',
  },
  embedNotification: {
    lineHeight: 26,
  },
});

class EmbedGroup extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = { loading: false, appNotificationShown: false, success: null };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  onCloseAppNotification = () => {
    this.setState({
      appNotificationShown: false,
    });
  }

  onEmbed = () => {
    const { embed, navigation } = this.props;
    const { id } = navigation.state.params;

    if (id) {
      this.setState({ loading: true });
      embed({ groupId: id })
        .then(() => this.setState({ loading: false, appNotificationShown: true, success: true }))
        .catch((err) => { console.warn(err); this.setState({ loading: false, appNotificationShown: true, success: false }); });
    }
  }

  renderEmbedContent = () => {
    if (this.props.navigation.state.params.type === OPEN_GROUP) {
      return (
        <View style={[styles.embedContentWrapper, styles.openGroup]}>
          <AppText size={16} style={styles.embedDescription} centered>{trans('group.get_the_html_code')}</AppText>
          <View style={styles.buttonWrapper}>
            {this.state.loading ?
              <Loading color="#fff" size="small" /> :
              <RoundedButton
                bgColor={Colors.background.pink}
                style={styles.button}
                onPress={() => this.onEmbed()}
              >
                {trans('group.email_the_code')}
              </RoundedButton>
            }
          </View>
          <AppText centered size={16} color={Colors.text.darkGray} style={styles.embedNotification}>{trans('group.enablers_of_the_group')}</AppText>
        </View>
      );
    }

    return (
      <View style={[styles.embedContentWrapper, styles.closeGroup]}>
        <AppText size={16} style={styles.embedDescription} centered>{trans('group.participants_in_open_groups')}</AppText>
        <AppText size={16} style={[styles.embedDescription, { marginTop: 26 }]} centered>{trans('group.this_is_a_closed_group')}</AppText>
        <AppText size={16} style={[styles.embedDescription, { paddingHorizontal: 10 }]} centered >{trans('group.the_settings_need_to_be_changed')}</AppText>
      </View>
    );
  }

  render() {
    const { appNotificationShown, success } = this.state;
    const notificationIcon = success ? SuccessIcon : ErrorIcon;
    const notificationTitle = success ? trans('detail.email_sent') : trans('global.email_not_sent');
    const notificationMessage = success ? trans('detail.check_your_inbox') : trans('global.please_try_again');
    return (
      <View style={{ flex: 1 }}>
        {
          appNotificationShown && (
            <AppNotification
              image={notificationIcon}
              type="icon"
              name={notificationTitle}
              message={notificationMessage}
              handleClose={this.onCloseAppNotification}
            />
          )
        }
        <ToolBar title={trans('group.embed_this_group')} />
        <ScrollView style={{ flex: 1 }}>
          <Heading
            size={24}
            style={styles.mainTitle}
            fontVariation="bold"
            color={Colors.text.pink}
          > {trans('group.wherever_you_want')}
          </Heading>
          <View style={styles.embedContainer}>
            <View style={styles.embedImages}>
              <Image source={EmbedWeb} style={{ marginRight: 36 }} />
              <Image source={EmbedMobile} />
            </View>
            {this.renderEmbedContent()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

EmbedGroup.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.number,
      }),
    }).isRequired,
  }).isRequired,
  embed: PropTypes.func.isRequired,
};

export default compose(withEmbed)(EmbedGroup);
