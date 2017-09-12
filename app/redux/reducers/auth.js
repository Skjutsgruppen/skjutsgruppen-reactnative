import { LOGIN, USER, LOGOUT } from '@redux/types/auth';

const initialState = {
  login: false,
  token: '',
  user: {},
};

const feed = (state = initialState, { type = '', payload = {} }) => {
  let newState = state;
  switch (type) {
    case LOGIN:
      newState = { ...state, ...{ login: true, token: payload.token, user: payload.user } };
      break;
    case USER:
      newState = { ...state, ...{ user: payload } };
      break;
    case LOGOUT:
      newState = { ...state, ...{ login: false, token: '', user: {} } };
      break;

    default:
      break;
  }

  return newState;
};

export default feed;
