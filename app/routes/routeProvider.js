import Register from '@screens/Register';
import Login from '@screens/Login';
import Splash from '@screens/Splash';
import Offer from '@screens/Offer';
import Group from '@screens/Group';
import GroupDetail from '@screens/GroupDetail';
import OfferDetail from '@screens/OfferDetail';
import Tab from '@screens/tab/main';
import { StackNavigator } from 'react-navigation';

export const Routes = {
  Splash: { screen: Splash },
  Login: { screen: Login },
  Register: { screen: Register },
  Tab: { screen: Tab },
  Offer: { screen: Offer },
  Group: { screen: Group },
  GroupDetail: { screen: GroupDetail, path: 'group/:id' },
  OfferDetail: { screen: OfferDetail, path: 'offer/:id' },
};

export const AppNavigator = StackNavigator(Routes, {
  initialRouteName: 'Splash',
});

export const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
