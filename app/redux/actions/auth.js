import { LOGIN, USER, LOGOUT } from '@redux/types/auth';

const authAction = {
  login: payload => ({ type: LOGIN, payload }),
  user: payload => ({ type: USER, payload }),
  logout: () => ({ type: LOGOUT }),
};

export default authAction;
