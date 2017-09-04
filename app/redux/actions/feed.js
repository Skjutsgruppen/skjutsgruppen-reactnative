import { FEED_FETCHING, FEED_FETCHED, FEED_ERROR } from '@redux/types/feed';

const feedActions = {
  fetching: () => ({ type: FEED_FETCHING }),
  fetched: payload => ({ type: FEED_FETCHED, payload }),
  error: payload => ({ type: FEED_ERROR, payload }),
};

export default feedActions;
