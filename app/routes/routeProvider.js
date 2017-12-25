import { StackNavigator, TabNavigator } from 'react-navigation';

import Splash from '@screens/Splash';
import Offer from '@screens/Offer';
import Ask from '@screens/Ask';

import Group from '@screens/group/Group';
import GroupDetail from '@screens/group/GroupDetail';
import ExploreGroup from '@screens/group/ExploreGroup';
import SearchGroup from '@screens/group/SearchGroup';

import OfferDetail from '@screens/new/OfferDetail';
import AskDetail from '@screens/new/AskDetail';

import RegisterMethod from '@screens/auth/register/Method';
import RegisterViaEmail from '@screens/auth/register/Email';
import CheckEMail from '@screens/auth/email/Check';
import EmailVerified from '@screens/auth/email/Verified';

import LoginMethod from '@screens/auth/login/Method';
import LoginViaEmail from '@screens/auth/login/Email';

import AddPhoto from '@screens/auth/AddPhoto';
import SendText from '@screens/auth/sms/SendText';
import MobileVerified from '@screens/auth/sms/MobileVerified';
import SearchResult from '@screens/Search';
import UserProfile from '@screens/profile/UserProfile';
import ChangePassword from '@screens/profile/ChangePassword';
import EditProfile from '@screens/profile/EditProfile';
import UserGroups from '@screens/profile/UserGroups';
import UserFriends from '@screens/profile/UserFriends';
import UserTrips from '@screens/profile/UserTrips';
import Settings from '@screens/Settings';

import Map from '@screens/Map';
import SingleNotification from '@screens/SingleNotification';
import Route from '@components/route';

import Add from '@screens/tab/add';
import Feed from '@screens/tab/feed';
import Message from '@screens/tab/message';
import Search from '@screens/tab/search';
import Support from '@screens/tab/support';

const TabRoutes = {
  Feed: {
    screen: Feed,
  },
  Add: {
    screen: Add,
  },
  Message: {
    screen: Message,
  },
  Search: {
    screen: Search,
  },
  Support: {
    screen: Support,
  },
};

const Tab = TabNavigator(TabRoutes,
  {
    lazy: true,
    animationEnabled: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#3b5998',
      inactiveTintColor: '#cccccc',
      showIcon: true,
      showLabel: false,
      iconStyle: {
        width: 35,
        height: 60,
      },
      tabStyle: {
        height: 40,
      },
      style: {
        backgroundColor: 'white',
      },
      pressColor: '#d5dcea',
      indicatorStyle: {
        backgroundColor: 'white',
      },
    },
  },
);
export const Routes = {
  Splash: { screen: Splash },

  RegisterMethod: { screen: RegisterMethod },
  RegisterViaEmail: { screen: RegisterViaEmail },
  CheckMail: { screen: CheckEMail },
  EmailVerified: { screen: EmailVerified },
  AddPhoto: { screen: AddPhoto },
  SendText: { screen: SendText },
  MobileVerified: { screen: MobileVerified },

  LoginMethod: { screen: LoginMethod },
  LoginViaEmail: { screen: LoginViaEmail },

  Map: { screen: Map },
  Route: { screen: Route },

  Tab: { screen: Tab },
  Offer: { screen: Offer },
  OfferDetail: { screen: OfferDetail, path: 'offer/:id' },
  Ask: { screen: Ask },
  AskDetail: { screen: AskDetail, path: 'ask/:id' },

  Group: { screen: Group },
  GroupDetail: { screen: GroupDetail, path: 'group/:id' },
  SearchGroup: { screen: SearchGroup, path: 'search/:query' },
  ExploreGroup: { screen: ExploreGroup },

  SearchResult: { screen: SearchResult },

  UserProfile: { screen: UserProfile },
  EditProfile: { screen: EditProfile },
  ChangePassword: { screen: ChangePassword },
  UserGroups: { screen: UserGroups },
  UserFriends: { screen: UserFriends },
  UserTrips: { screen: UserTrips },

  SingleNotification: { screen: SingleNotification },
  Settings: { screen: Settings },
};

export const AppNavigator = StackNavigator(Routes, {
  initialRouteName: 'Splash',
});

export const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
