import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import FCM from 'react-native-fcm';
import LinearGradient from 'react-native-linear-gradient';
import { RoundedButton, Avatar, CostCard } from '@components/common';
import ProfileAction from '@components/profile/profileAction';
import { Colors, Gradients } from '@theme';
import BasketIcon from '@assets/icons/ic_sustain_basket.png';
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

const styles = StyleSheet.create({
  basket: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 24,
    marginHorizontal: 24,
  },
  heading: {
    alignSelf: 'center',
    maxWidth: 280,
    backgroundColor: 'transparent',
    color: Colors.text.yellowGreen,
    textAlign: 'center',
    marginBottom: 24,
    marginHorizontal: 24,
  },
  text: {
    alignSelf: 'center',
    maxWidth: 220,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 24,
  },
  button: {
    marginTop: 36,
    marginBottom: 36,
    width: '100%',
    maxWidth: 200,
    alignSelf: 'center',
  },
  supporterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 50,
  },
  avatar: {
    marginHorizontal: 10,
  },
  readMore: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
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

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  tabEvent = (e, type) => {
    if (this.scrollView && type === 'didBlur') {
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
    return (
      <LinearGradient style={{ flex: 1 }} colors={Gradients.white}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }}>
          <Image source={BasketIcon} style={styles.basket} />
          <Text style={styles.heading}>{trans('profile.this_app_is_a_self_sustaining_garden')}</Text>
          <Text style={styles.text}>
            {trans('profile.all_of_us_who_use_the_app_helps_to_work_with_money')}
          </Text>
          <RoundedButton
            onPress={() => { }}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            {trans('profile.support_now')}
          </RoundedButton>
          <View style={styles.supporterWrapper}>
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
          </View>
          <Text style={[styles.heading, { color: Colors.text.blue }]}>
            {trans('profile.right_now_your_friends_and_others_supports_cost')}
          </Text>
          <CostCard title={trans('profile.server_cost')} coveredPercentage={100} totalCost="2400" />
          <CostCard title={trans('profile.a_programmer')} coveredPercentage={50} totalCost="18000" />
          <CostCard title={trans('profile.project_manager')} coveredPercentage={0} totalCost="xxxx" />
          <View style={styles.readMore}>
            <Text style={styles.text}>
              {trans('profile.participants_who_support_the_garden_get_a_grean')}
            </Text>
            <RoundedButton
              onPress={() => { }}
              bgColor={Colors.background.pink}
              style={styles.button}
            >
              {trans('profile.read_more')}
            </RoundedButton>
          </View>
          <ProfileAction
            title={trans('profile.we_are_open_source')}
            label={trans('profile.help_make_the_app_better')}
            icon={require('@assets/icons/ic_github.png')}
          />
          <ProfileAction
            title={trans('profile.open_api')}
            label={trans('profile.build_get_statistics_and_more')}
            icon={require('@assets/icons/ic_open_api.png')}
          />
          <ProfileAction
            label={trans('profile.about_the_movement')}
          />
          <ProfileAction
            label={trans('profile.international_ridesharingday')}
          />
          <ProfileAction
            label={trans('profile.your_profile')}
            onPress={() => this.redirect('Profile')}
          />
          <ProfileAction
            label={trans('profile.your_support_of_the_garden')}
          />
          <ProfileAction
            label={trans('profile.notification_setting')}
          />
          <ProfileAction
            label={trans('profile.participant_agreement')}
          />
          <TouchableOpacity onPress={this.logout} style={styles.logout}>
            <Text style={{ color: Colors.text.blue, backgroundColor: 'transparent' }}>{trans('profile.log_out')}</Text>
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
};

export default compose(withRemoveAppToken, connect(mapStateToProps, mapDispatchToProps))(Garden);
