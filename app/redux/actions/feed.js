import { FETCHING, FETCHED, ERROR } from '@redux/types/feed';

const feedActions = {
  fetching: () => ({ type: FETCHING }),
  fetched: payload => ({ type: FETCHED, payload }),
  error: payload => ({ type: ERROR, payload }),
};

export default feedActions;
