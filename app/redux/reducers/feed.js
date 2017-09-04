import { FEED_FETCHING, FEED_FETCHED, FEED_ERROR } from '@redux/types/feed';

const initialState = {
  fetching: true,
  items: [],
  error: null,
};

const feed = (state = initialState, { type = '', payload = {} }) => {
  let newState = state;
  switch (type) {
    case FEED_FETCHING:
      newState = { ...state, ...{ fetching: true } };
      break;

    case FEED_FETCHED:
      newState = { ...state, ...{ items: payload, fetching: false, error: null } };
      break;

    case FEED_ERROR:
      newState = { ...state, ...{ items: [], fetching: false, error: payload.error } };
      break;

    default:
      break;
  }

  return newState;
};

export default feed;
