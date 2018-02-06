import { LOGIN, USER, LOGOUT, REGISTER, PHONEVERIFICATION } from '@redux/types/auth';

const authAction = {
  login: payload => ({ type: LOGIN, payload }),
  register: payload => ({ type: REGISTER, payload }),
  user: payload => ({ type: USER, payload }),
  phoneVerification: payload => ({ type: PHONEVERIFICATION, payload }),
  logout: () => ({ type: LOGOUT }),
};

export default authAction;
