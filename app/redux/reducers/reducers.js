import { combineReducers } from 'redux';
import { navReducer } from '@routes/routeProvider';
import { apolloReducer } from 'apollo-cache-redux';
import feed from '@redux/reducers/feed';
import auth from '@redux/reducers/auth';

export default combineReducers({ feed, auth, apollo: apolloReducer, nav: navReducer });
