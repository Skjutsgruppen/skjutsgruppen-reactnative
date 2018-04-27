import React, { Component } from 'react';
import { StyleSheet, ScrollView, Alert, Image, TouchableOpacity, NativeModules } from 'react-native';
import FCM from 'react-native-fcm';
import LinearGradient from 'react-native-linear-gradient';
import ProfileAction from '@components/profile/profileAction';
import { Colors, Gradients } from '@theme';
import SupportIcon from '@assets/icons/ic_support.png';
import SupportIconActive from '@assets/icons/ic_support_active.png';
import AuthService from '@services/auth';
import AuthAction from '@redux/actions/auth';
import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { compose } from 'react-apollo';
import { withRemoveAppToken } from '@services/apollo/profile';
import { getDeviceId } from '@helpers/device';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';
import Package from '@components/garden/subscriptionPackage';
import Header from '@components/garden/header';
import HelpMore from '@components/garden/helpMore';
import HowItWorks from '@components/garden/howItWorks';
import Costs from '@components/garden/costs';
import { withSupport, withGenerateClientToken } from '@services/apollo/support';

import GithubIcon from '@assets/icons/ic_github.png';
import OpenAPIIcon from '@assets/icons/ic_open_api.png';

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
  }


  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ scrollToTop: this.scrollToTop });
    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));
  }

  shouldComponentUpdate() {
    return false;
  }

  onSupportSubscribe = (planId) => {
    const { support, generateClientToken } = this.props;

    NativeModules.BraintreePayment.setToken(generateClientToken);
    NativeModules.BraintreePayment.showPayment((paymentMethodNonce) => {
      support({ planId, paymentMethodNonce })
        .then(() => {
          Alert.alert(trans('profile.subscribed_success'));
        });
    }, (error) => {
      console.warn(error);
    });
  }

  tabEvent = (e, type) => {
    if (this.scrollView && type === 'didBlur') {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
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
      await FCM.cancelAllLocalNotifications();
      logout()
        .then(() => LoginManager.logOut())
        .then(() => this.reset())
        .catch(() => this.reset());
    });
  }

  reset = () => {
    const { navigation } = this.props;
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

  render() {
    const supporter = true;
    const headingLabel = supporter ? trans('profile.you_are_awesome')
      : trans('profile.this_app_is_a_self_sustaining_garden');
    const infoLabel = supporter ? trans('profile.right_now_you_support')
      : trans('profile.all_of_us_who_use_the_app_helps_to_work_with_money');

    return (
      <LinearGradient style={{ flex: 1 }} colors={Gradients.white}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <Header
            showTitle={!supporter}
            showAvatar={supporter}
            headingLabel={headingLabel}
            infoLabel={infoLabel}
          />
          <Package
            noBackgroud
            elevation={0}
            durationLabel="Support six month"
            monthlyAmount={9}
            planId={1}
            supportSubscribe={this.onSupportSubscribe}
            info="Total of 54 kr, auto-renewed every six month. Stop when ever you want."
          />
          <Package
            elevation={20}
            durationLabel="Support one month"
            monthlyAmount={29}
            planId={2}
            supportSubscribe={this.onSupportSubscribe}
            info="Total of 29 kr, auto-renewed every six month. Stop when ever you want."
          />
          <HelpMore
            supportSubscribe={this.onSupportSubscribe}
          />
          <HowItWorks />
          <Costs supporter={supporter} />
          <ProfileAction
            title={trans('profile.we_are_open_source')}
            label={trans('profile.help_make_the_app_better')}
            icon={GithubIcon}
          />
          <ProfileAction
            title={trans('profile.open_api')}
            label={trans('profile.build_get_statistics_and_more')}
            icon={OpenAPIIcon}
          />
          <ProfileAction label={trans('profile.about_the_movement')} />
          <ProfileAction label={trans('profile.international_ridesharingday')} />
          <ProfileAction
            label={trans('profile.your_profile')}
            onPress={() => this.redirect('Profile')}
          />
          <ProfileAction label={trans('profile.your_support_of_the_garden')} />
          <ProfileAction label={trans('profile.notification_setting')} />
          <ProfileAction label={trans('profile.participant_agreement')} />
          <TouchableOpacity onPress={this.logout} style={styles.logout}>
            <AppText
              color={Colors.text.blue}
            >{trans('profile.log_out')}</AppText>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  logout: () => AuthService.logout()
    .then(() => dispatch(AuthAction.logout()))
    .catch(error => console.warn(error)),
});

Garden.propTypes = {
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  removeAppToken: PropTypes.func.isRequired,
  support: PropTypes.func.isRequired,
  generateClientToken: PropTypes.string,
};

Garden.defaultProps = {
  generateClientToken: null,
};

export default compose(
  withGenerateClientToken,
  withRemoveAppToken,
  withSupport,
  connect(mapStateToProps, mapDispatchToProps),
)(Garden);
