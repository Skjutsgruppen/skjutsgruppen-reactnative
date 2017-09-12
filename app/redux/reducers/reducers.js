import { combineReducers } from 'redux';
import Apollo from '@services/apollo';
import { navReducer } from '@routes/routeProvider';
import feed from './feed';
import auth from './auth';

export default combineReducers({ feed, auth, apollo: Apollo.reducer(), nav: navReducer });
