import { NavigationActions } from 'react-navigation';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';


const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const tracker = new GoogleAnalyticsTracker('UA-112992337-1');

const screenTracker = ({ getState }) => next => (action) => {

  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    tracker.trackScreenView(nextScreen);
  }
  return result;
};

export default screenTracker;
