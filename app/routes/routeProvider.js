import { StackNavigator, TabNavigator } from 'react-navigation';
import Splash from '@screens/Splash';

import Offer from '@screens/Offer';
import Ask from '@screens/Ask';
import Settings from '@screens/Settings';
import Group from '@screens/group/Group';
import Experience from '@screens/experience/Experience';

import TripDetail from '@screens/TripDetail';
import NewsDetail from '@screens/NewsDetail';
import GroupDetail from '@screens/group/GroupDetail';
import ExperienceDetail from '@screens/experience/ExperienceDetail';

import AlphabeticalGroupsList from '@screens/group/AlphabeticalGroupsList';
import ExploreGroup from '@screens/group/ExploreGroup';
import GroupsInCounty from '@screens/group/GroupsInCounty';
import SharedTrip from '@screens/group/SharedTrip';
import EmbedGroup from '@screens/group/EmbedGroup';

import Welcome from '@screens/auth/welcome/Welcome';
import WelcomeTwo from '@screens/auth/welcome/WelcomeTwo';
import Boarding from '@screens/auth/boarding/Boarding';
import Onboarding from '@screens/auth/onboarding/Onboarding';
import Agreement from '@screens/auth/login/Agreement';
import Registration from '@screens/auth/login/Registration';

import LoginMethod from '@screens/auth/login/Method';
import LoginViaEmail from '@screens/auth/login/Email';
import ChangePassword from '@screens/profile/ChangePassword';
import ChangeEmail from '@screens/profile/ChangeEmail';
import ChangePhoneNumber from '@screens/profile/ChangePhoneNumber';
import ForgotPassword from '@screens/auth/login/ForgotPassword';

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
import Area from '@screens/Area';
import CloseByGroupsMap from '@screens/CloseByGroupsMap';

import SearchNotification from '@screens/notification/Search';

import Add from '@screens/tab/add';
import Feed from '@screens/tab/feed';
import Message from '@screens/tab/message';
import Search from '@screens/tab/search';
import Garden from '@screens/tab/garden';
import YourSupport from '@screens/garden/yourSupport';
import SupportReadMore from '@screens/garden/ReadMore';
import PackageDetail from '@screens/garden/packageDetail';

import Report from '@screens/modal/Report';

import GroupInformation from '@screens/group/GroupInformation';
import EnablerList from '@screens/group/EnablerList';
import AddEnabler from '@screens/group/AddEnabler';
import MembershipRequest from '@screens/group/MembershipRequest';
import Participants from '@screens/group/Participants';
import AddParticipant from '@screens/group/AddParticipant';
import EditGroup from '@screens/group/EditGroup';
import EmbedTrip from '@screens/EmbedTrip';

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
    swipeEnabled: true,
    animationEnabled: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#3b5998',
      inactiveTintColor: '#cccccc',
      showIcon: true,
      showLabel: false,
      iconStyle: {
        width: 60,
        height: 60,
      },
      tabStyle: {
        height: 60,
        opacity: 1,
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
  Settings: { screen: Settings },
  YourSupport: { screen: YourSupport },
  SupportReadMore: { screen: SupportReadMore },
  PackageDetail: { screen: PackageDetail },

  TripDetail: { screen: TripDetail, path: 'trip/:id' },
  NewsDetail: { screen: NewsDetail, path: 'news/:id' },
  GroupDetail: { screen: GroupDetail, path: 'group/:id' },
  ExperienceDetail: { screen: ExperienceDetail },

  AlphabeticalGroupsList: { screen: AlphabeticalGroupsList },
  ExploreGroup: { screen: ExploreGroup },
  GroupsInCounty: { screen: GroupsInCounty },
  SearchResult: { screen: SearchResult },
  EmbedGroup: { screen: EmbedGroup },
  EmbedTrip: { screen: EmbedTrip },

  Welcome: { screen: Welcome },
  WelcomeTwo: { screen: WelcomeTwo },
  Boarding: { screen: Boarding },
  Onboarding: { screen: Onboarding },
  Agreement: { screen: Agreement },
  Registration: { screen: Registration },

  LoginMethod: { screen: LoginMethod },
  LoginViaEmail: { screen: LoginViaEmail },
  ForgotPassword: { screen: ForgotPassword },
  ChangePassword: { screen: ChangePassword },
  ChangeEmail: { screen: ChangeEmail },
  ChangePhoneNumber: { screen: ChangePhoneNumber },

  Map: { screen: Map },
  Route: { screen: Route },
  Area: { screen: Area },

  Tab: {
    screen: Tab,
    headerMode: 'none',
    navigationOptions: {
      header: null,
    },
  },

  Profile: { screen: Profile },
  EditProfile: { screen: EditProfile },
  UserGroups: { screen: UserGroups },
  UserFriends: { screen: UserFriends },
  UserTrips: { screen: UserTrips },
  UserExperiences: { screen: UserExperiences },
  UserConversation: { screen: UserConversation },

  SearchNotification: { screen: SearchNotification },

  Report: { screen: Report },
  SharedTrip: { screen: SharedTrip },

  GroupInformation: { screen: GroupInformation },
  EnablerList: { screen: EnablerList },
  AddEnabler: { screen: AddEnabler },
  MembershipRequest: { screen: MembershipRequest },
  Participants: { screen: Participants },
  AddParticipant: { screen: AddParticipant },
  EditGroup: { screen: EditGroup },
  CloseByGroupsMap: { screen: CloseByGroupsMap },
};

export const AppNavigator = StackNavigator(Routes,
  {
    initialRouteName: 'Splash',
  },
);

export const navReducer = (state, action) => {
  // const { routeName } = action;
  // let repeatedRoute = [];
  // if (state && state.routes) {
  //   repeatedRoute = state.routes.filter((route) => {
  //     if (route.routeName && route.routeName === routeName) {
  //       if (!route.params && !action.params) return true;
  //       if ((route.params && !action.params) || (!route.params && action.params)) return false;
  //       if (route.params.id && action.params.id && route.params.id === action.params.id) {
  //         return true;
  //       }

  //       if (route.params.profileId && action.params.profileId
  //         && route.params.profileId === action.params.profileId) {
  //         return true;
  //       }

  //       if (route.params.activeStep && action.params.activeStep
  //         && route.params.activeStep === action.params.activeStep) {
  //         return true;
  //       }

  //       return false;
  //     }

  //     return false;
  //   });
  // }

  // if (repeatedRoute && repeatedRoute.length < 1) {
  const newState = AppNavigator.router.getStateForAction(action, state);

  return newState;
  // }

  // return state;
};
