import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
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
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
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
    const { logout } = this.props;
    this.setState({ loading: true }, () => {
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
          <Text style={styles.heading}>This app is an self-sustaining garden</Text>
          <Text style={styles.text}>
            All of us who use the app helps the app to work with money and/or knowledge.
          </Text>
          <RoundedButton
            onPress={() => { }}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            Support now
          </RoundedButton>
          <View style={styles.supporterWrapper}>
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
            <Avatar isSupporter size={62} source={require('@assets/profilePic.jpg')} style={styles.avatar} />
          </View>
          <Text style={[styles.heading, { color: Colors.text.blue }]}>
            Right now your friends and others support these costs:
          </Text>
          <CostCard title="Server Costs" coveredPercentage={100} totalCost="2400" />
          <CostCard title="A programmer" coveredPercentage={50} totalCost="18000" />
          <CostCard title="Project manager" coveredPercentage={0} totalCost="xxxx" />
          <View style={styles.readMore}>
            <Text style={styles.text}>
              Participants who support the garden get a green leaf next to their profile
              picture and can add photos to rides.
            </Text>
            <RoundedButton
              onPress={() => { }}
              bgColor={Colors.background.pink}
              style={styles.button}
            >
              Read more
            </RoundedButton>
          </View>
          <ProfileAction
            title="We are Open Source!"
            label="Help make the app better"
            icon={require('@assets/icons/ic_github.png')}
          />
          <ProfileAction
            title="Open API"
            label="Build, get statistics and more"
            icon={require('@assets/icons/ic_open_api.png')}
          />
          <ProfileAction
            label="About the movement"
          />
          <ProfileAction
            label="The international #RidesharingDay"
          />
          <ProfileAction
            label="Your profile"
            onPress={() => this.redirect('Profile')}
          />
          <ProfileAction
            label="Your support of the garden"
          />
          <ProfileAction
            label="Notification setting"
          />
          <ProfileAction
            label="Participant agreement"
          />
          <TouchableOpacity onPress={this.logout} style={styles.logout}>
            <Text style={{ color: Colors.text.blue }}>Log Out</Text>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Garden);
