import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, View, Linking } from 'react-native';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { compose } from 'react-apollo';
import { resetLocalStorage } from '@services/apollo/dataSync';
import ProfileAction from '@components/profile/profileAction';
import { Colors, Gradients } from '@theme';
import SupportIcon from '@assets/icons/ic_support.png';
import SupportIconActive from '@assets/icons/ic_support_active.png';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { withRemoveAppToken, withAccount } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import { trans } from '@lang/i18n';
import { AppText, Title } from '@components/utils/texts';
import Package from '@components/garden/subscriptionPackage';
import Header from '@components/garden/header';
import HelpMore from '@components/garden/helpMore';
import HowItWorks from '@components/garden/howItWorks';
import Costs from '@components/garden/costs';
import { withMySupport, verifyLatestSupport } from '@services/apollo/support';
import GithubIcon from '@assets/icons/ic_github.png';
import OpenAPIIcon from '@assets/icons/ic_open_api.png';
import { ConfirmModal, AppNotification } from '@components/common';
import ErrorIcon from '@assets/icons/ic_warning.png';
import SuccessIcon from '@assets/icons/ic_checked_green.png';
import { getLatestSubscription } from '@services/support/purchase';

const styles = StyleSheet.create({
  curves: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  header: {
    padding: 30,
    paddingTop: 50,
  },
  heading: {
    maxWidth: 220,
    lineHeight: 46,
    marginBottom: 24,
  },
  headerDivider: {
    height: 1,
    width: 64,
    backgroundColor: Colors.text.lightGray,
    marginTop: 24,
    marginBottom: 32,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  linkContent: {
    padding: 30,
    marginBottom: 32,
  },
  miniDivider: {
    height: 1,
    width: 64,
    backgroundColor: Colors.text.lightGray,
    marginTop: 24,
    marginBottom: 26,
  },
});

class Garden extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Garden',
    tabBarIcon: ({ focused }) => <Image source={focused ? SupportIconActive : SupportIcon} />,
    tabBarOnPress: ({ scene, jumpToIndex }) => {
      if (scene.focused) {
        const navigationInRoute = scene.route;
        if (!!navigationInRoute
          && !!navigationInRoute.params
          && !!navigationInRoute.params.scrollToTop) {
          navigationInRoute.params.scrollToTop();
        }
      }
      jumpToIndex(4);
    },
  };

  constructor(props) {
    super(props);
    this.scrollView = null;
    this.state = {
      subscribing: false,
      showAppNotification: false,
      alertMessage: '',
      error: false,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;

    navigation.setParams({ scrollToTop: this.scrollToTop });
  }

  componentDidMount() {
    const { subscribeToUpdatedProfile, data, verifySupport } = this.props;

    subscribeToUpdatedProfile({ id: data.profile.id });
    getLatestSubscription((error, latestSubscription) => {
      if (error) {
        console.warn(error);
        return;
      }
      verifySupport(latestSubscription)
        .then(() => {
        })
        .catch((e) => {
          console.warn(e);
        });
    });
  }

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  logout = () => {
    const { logout, removeAppToken } = this.props;
    this.setState({ loading: true }, async () => {
      await removeAppToken(getDeviceId());
      await firebase.notifications().cancelAllNotifications();
      logout()
        .then(() => LoginManager.logOut())
        .then(() => this.reset())
        .catch(() => this.reset());
    });
  }

  reset = async () => {
    const { navigation } = this.props;
    await resetLocalStorage();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });
    navigation.dispatch(resetAction);
  }

  redirect = (path) => {
    const { navigation } = this.props;

    navigation.navigate(path);
  }

  openLink = (link) => {
    Linking.canOpenURL(link).then((supported) => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.warn('Cannot open given URL.');
      }
    });
  };

  render() {
    const { data, mySupport } = this.props;
    const { subscribing, showAppNotification, alertMessage, error } = this.state;

    if (!data.profile) return null;

    // to test in app purchase
    const supporter = data.profile.isSupporter || false;
    const isAdmin = data.profile.isAdmin || false;
    // const headingLabel = supporter ? trans('profile.you_are_awesome')
    //   : isAdmin? trans('profile.this_app_is_a_self_sustaining_garden') ;
    // const infoLabel = supporter ? trans('profile.right_now_you_support')
    //   : trans('profile.all_of_us_who_use_the_app_helps_to_work_with_money');

    // const headingLabel = supporter ? trans('profile.you_are_awesome')
    //   : trans('profile.this_app_will_soon_be_a_self_sustaining_garden');
    // const infoLabel = supporter ? trans('profile.right_now_you_support')
    //   : trans('profile.as_you_can_see_all_of_are_right_now_co_creating');

    let headingLabel;
    let infoLabel;
    if (isAdmin) {
      headingLabel = supporter ? trans('profile.this_app_is_a_self_sustaining_garden') :
        trans('profile.this_app_is_a_self_sustaining_garden');
      infoLabel = supporter ? trans('profile.right_now_you_support') :
        trans('profile.as_you_can_see_all_of_are_right_now_co_creating');
    } else {
      headingLabel = trans('profile.this_app_will_soon_be_a_self_sustaining_garden');
      infoLabel = trans('profile.as_you_can_see_all_of_are_right_now_co_creating');
    }

    return (
      <LinearGradient style={{ flex: 1 }} colors={Gradients.white}>
        {
          showAppNotification && (
            <AppNotification
              name={alertMessage}
              type="icon"
              image={error ? ErrorIcon : SuccessIcon}
              handleClose={() => this.setState({ showAppNotification: false })}
            />
          )
        }
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <Header
            showTitle={!supporter}
            showAvatar={supporter}
            headingLabel={headingLabel}
            infoLabel={infoLabel}
            user={data.profile}
          />
          { !isAdmin &&
            <View style={styles.linkContent}>
              <TouchableOpacity onPress={() => this.openLink(trans('feed.trello_url'))}>
                <AppText
                  size={26}
                  fontVariation="semibold"
                  color={Colors.text.blue}
                >
                  {trans('profile.go_to_trello')}
                </AppText>
              </TouchableOpacity>
              <View style={styles.miniDivider} />
              <TouchableOpacity onPress={() => this.openLink(trans('feed.github_url'))}>
                <AppText
                  fontVariation="semibold"
                  size={26}
                  color={Colors.text.blue}
                  style={{ marginBottom: 48 }}
                >
                  {trans('profile.go_to_github')}
                </AppText>
              </TouchableOpacity>
              <Title size={23} color={Colors.text.gray} style={{ lineHeight: 36 }}>
                {trans('profile.we_are_currently_also_building')}
              </Title>
            </View>
          }
          {!supporter && isAdmin &&
            <View>
              <Package
                noBackgroud
                elevation={0}
                planId={'10_kr_per_month'}
                info={trans('profile.total_of_10_auto_renewed_every_month')}
                title="Support a month"
                currentlySupporting={mySupport.data.currentSubscriptionPlan}
                amountPerMonth="10"
                showAppNotification={(err, message) => {
                  this.setState({ showAppNotification: true, error: err, alertMessage: message });
                }}
              />
              <Package
                elevation={20}
                planId={'29_kr_per_month_garden'}
                title="Support a month"
                info={trans('profile.total_of_29_auto_renewed_every_month')}
                currentlySupporting={mySupport.data.currentSubscriptionPlan}
                amountPerMonth="29"
                showAppNotification={(err, message) => {
                  this.setState({ showAppNotification: true, error: err, alertMessage: message });
                }}
              />
              <HelpMore
                currentlySupporting={mySupport.data.currentSubscriptionPlan}
                showAppNotification={(err, message) => {
                  this.setState({ showAppNotification: true, error: err, alertMessage: message });
                }}
              />
              <HowItWorks />
            </View>
          }
          {isAdmin &&
            <Costs supporter={supporter} showCostTitle={!supporter} showDescription={false} />
          }
          <ProfileAction
            onPress={() => this.openLink(trans('feed.github_url'))}
            title={trans('profile.we_are_open_source')}
            label={trans('profile.help_make_the_app_better')}
            icon={GithubIcon}
          />
          <ProfileAction
            onPress={() => this.openLink('https://www.transifex.com/skjutsgruppen/the-ridesharing-movement-skjutsgruppen-app/')}
            title={trans('profile.translate')}
            label={trans('profile.help_translate')}
          />
          {/* <ProfileAction
            title={trans('profile.open_api')}
            label={trans('profile.build_get_statistics_and_more')}
            icon={OpenAPIIcon}
          />
          <ProfileAction label={trans('profile.about_the_movement')} />
          <ProfileAction label={trans('profile.international_ridesharingday')} /> */}
          <ProfileAction
            label={trans('profile.your_profile')}
            onPress={() => this.redirect('Profile')}
          />
          {mySupport.data && mySupport.data.subscriptions.length > 0 &&
            <ProfileAction
              label={trans('profile.your_support_of_the_garden')}
              onPress={() => this.redirect('YourSupport')}
            />
          }
          <ProfileAction onPress={() => this.redirect('Settings')} label={trans('profile.settings')} />
          <ProfileAction
            onPress={() => this.openLink('https://web.skjutsgruppen.nu/participant-agreement')}
            label={trans('profile.participant_agreement')}
          />
          <ProfileAction
            onPress={() => this.openLink('https://web.skjutsgruppen.nu/privacy-policy')}
            label={trans('profile.privacy_policy')}
          />
          <TouchableOpacity onPress={this.logout} style={styles.logout}>
            <AppText
              color={Colors.text.blue}
            >{trans('profile.log_out')}</AppText>
          </TouchableOpacity>
        </ScrollView>
        <ConfirmModal
          loading={subscribing}
          visible={subscribing}
          cancelable={false}
          onConfirm={() => {}}
          onDeny={() => {}}
        />
      </LinearGradient>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

Garden.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape(),
  }).isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  removeAppToken: PropTypes.func.isRequired,
  subscribeToUpdatedProfile: PropTypes.func.isRequired,
  verifySupport: PropTypes.func.isRequired,
  mySupport: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

Garden.defaultProps = {
};

export default compose(
  withRemoveAppToken,
  withMySupport,
  withAccount,
  verifyLatestSupport,
  connect(null, mapDispatchToProps),
)(Garden);
