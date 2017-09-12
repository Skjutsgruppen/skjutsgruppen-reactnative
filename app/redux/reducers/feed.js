import { FETCHING, FETCHED, ERROR } from '@redux/types/feed';

const initialState = {
  fetching: true,
  items: [],
  error: null,
};

const feed = (state = initialState, { type = '', payload = {} }) => {
  let newState = state;
  switch (type) {
    case FETCHING:
      newState = { ...state, ...{ fetching: true } };
      break;

    case FETCHED:
      newState = { ...state, ...{ items: payload, fetching: false, error: null } };
      break;

    case ERROR:
      newState = { ...state, ...{ items: [], fetching: false, error: payload.error } };
      break;

    default:
      break;
  }

  return newState;
};

export default feed;
