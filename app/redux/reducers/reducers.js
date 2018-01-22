import { combineReducers } from 'redux';
import Apollo from '@services/apollo';
import { navReducer } from '@routes/routeProvider';
import auth from '@redux/reducers/auth';

export default combineReducers({ auth, apollo: Apollo.reducer(), nav: navReducer });
