
import Splash from '@screens/Splash';
import Offer from '@screens/Offer';
import Group from '@screens/Group';
import GroupDetail from '@screens/GroupDetail';
import OfferDetail from '@screens/OfferDetail';
import Tab from '@screens/tab/main';

import RegisterMethod from '@screens/auth/register/Method';
import RegisterViaEmail from '@screens/auth/register/Email';
import CheckEMail from '@screens/auth/email/Check';
import EmailVerified from '@screens/auth/email/Verified';

import LoginMethod from '@screens/auth/login/Method';
import LoginViaEmail from '@screens/auth/login/Email';

import AddPhoto from '@screens/auth/AddPhoto';
import SendText from '@screens/auth/sms/SendText';
import MobileVerified from '@screens/auth/sms/MobileVerified';

import { StackNavigator } from 'react-navigation';

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
