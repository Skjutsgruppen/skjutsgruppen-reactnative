import Api from './Api';

const Feed = {
  fetch: () => Api.get('posts'),
};

export default Feed;
