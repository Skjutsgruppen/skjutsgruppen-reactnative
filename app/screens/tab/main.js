import { TabNavigator, StackNavigator } from 'react-navigation';
import Add from '@screens/tab/add';
import Feed from '@screens/tab/feed';
import Message from '@screens/tab/message';
import Search from '@screens/tab/search';
import Support from '@screens/tab/support';

export const SearchRoute = StackNavigator(
  {
    Search: {
      screen: Search,
    },
  },
);

const Tab = TabNavigator(
  {
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
  },
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

export default Tab;
