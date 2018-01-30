import { StackNavigator, TabNavigator } from 'react-navigation';
import Splash from '@screens/Splash';

import Offer from '@screens/Offer';
import Ask from '@screens/Ask';
import Group from '@screens/group/Group';
import Experience from '@screens/experience/Experience';

import TripDetail from '@screens/TripDetail';
import NewsDetail from '@screens/NewsDetail';
import GroupDetail from '@screens/group/GroupDetail';
import ExperienceDetail from '@screens/experience/ExperienceDetail';
import ExperienceScreen from '@screens/experience/ExperienceScreen';

import ExploreGroup from '@screens/group/ExploreGroup';
import SearchGroup from '@screens/group/SearchGroup';

import OnBoardingFirst from '@screens/auth/onboarding/first';
import OnBoardingSecond from '@screens/auth/onboarding/second';
import OnBoardingThird from '@screens/auth/onboarding/third';
import OnBoardingFourth from '@screens/auth/onboarding/fourth';
import OnBoardingFifth from '@screens/auth/onboarding/fifth';

import RegisterMethod from '@screens/auth/register/Method';
import RegisterViaEmail from '@screens/auth/register/Email';
import CheckEMail from '@screens/auth/email/Check';
import EmailVerified from '@screens/auth/email/Verified';

import LoginMethod from '@screens/auth/login/Method';
import LoginViaEmail from '@screens/auth/login/Email';
import ChangePassword from '@screens/profile/ChangePassword';

import AddPhoto from '@screens/auth/AddPhoto';
import SendText from '@screens/auth/sms/SendText';
import MobileVerified from '@screens/auth/sms/MobileVerified';
import SearchResult from '@screens/Search';

import Profile from '@screens/profile/Profile';
import EditProfile from '@screens/profile/EditProfile';
import UserGroups from '@screens/profile/UserGroups';
import UserFriends from '@screens/profile/UserFriends';
import UserTrips from '@screens/profile/UserTrips';
import UserExperiences from '@screens/profile/UserExperiences';
import UserConversation from '@screens/profile/UserConversation';

import Map from '@screens/Map';
import Route from '@screens/Route';

import SingleNotification from '@screens/notification/List';
import SearchNotification from '@screens/notification/Search';
import ActiveRideList from '@screens/notification/ActiveRideList';
import ActiveGroupList from '@screens/notification/ActiveGroupList';

import Add from '@screens/tab/add';
import Feed from '@screens/tab/feed';
import Message from '@screens/tab/message';
import Search from '@screens/tab/search';
import Garden from '@screens/tab/garden';

const TabRoutes = {
  Feed: {
    screen: Feed,
  },
  Add: {
    screen: Add,
  },
  Search: {
    screen: Search,
  },
  Message: {
    screen: Message,
  },
  Garden: {
    screen: Garden,
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
        height: 60,
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

  Offer: { screen: Offer },
  Ask: { screen: Ask },
  Experience: { screen: Experience },
  Group: { screen: Group },

  TripDetail: { screen: TripDetail, path: 'trip/:id' },
  NewsDetail: { screen: NewsDetail, path: 'news/:id' },
  GroupDetail: { screen: GroupDetail, path: 'group/:id' },

  SearchGroup: { screen: SearchGroup, path: 'search/:query' },
  ExploreGroup: { screen: ExploreGroup },
  SearchResult: { screen: SearchResult },

  OnBoardingFirst: { screen: OnBoardingFirst },
  OnBoardingSecond: { screen: OnBoardingSecond },
  OnBoardingThird: { screen: OnBoardingThird },
  OnBoardingFourth: { screen: OnBoardingFourth },
  OnBoardingFifth: { screen: OnBoardingFifth },

  RegisterMethod: { screen: RegisterMethod },
  RegisterViaEmail: { screen: RegisterViaEmail },
  CheckMail: { screen: CheckEMail },
  EmailVerified: { screen: EmailVerified },
  AddPhoto: { screen: AddPhoto },
  SendText: { screen: SendText },
  MobileVerified: { screen: MobileVerified },

  LoginMethod: { screen: LoginMethod },
  LoginViaEmail: { screen: LoginViaEmail },
  ChangePassword: { screen: ChangePassword },

  Map: { screen: Map },
  Route: { screen: Route },

  Tab: { screen: Tab },

  Profile: { screen: Profile },
  EditProfile: { screen: EditProfile },
  UserGroups: { screen: UserGroups },
  UserFriends: { screen: UserFriends },
  UserTrips: { screen: UserTrips },
  UserExperiences: { screen: UserExperiences },
  UserConversation: { screen: UserConversation },

  SingleNotification: { screen: SingleNotification },
  ActiveRideList: { screen: ActiveRideList },
  ActiveGroupList: { screen: ActiveGroupList },
  SearchNotification: { screen: SearchNotification },

  ExperienceDetail: { screen: ExperienceDetail },
  ExperienceScreen: { screen: ExperienceScreen },
};

export const AppNavigator = StackNavigator(Routes, {
  initialRouteName: 'Splash',
});

export const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
