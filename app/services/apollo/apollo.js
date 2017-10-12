import ApolloClient, { createNetworkInterface, IntrospectionFragmentMatcher } from 'apollo-client';
import { API_URL } from '@config';
import Auth from '@services/auth';

const networkInterface = createNetworkInterface({ uri: API_URL });

networkInterface.use([{
  async applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    const token = await Auth.token();
    req.options.headers.authorization = token;
    next();
  },
}]);


const feedFragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'Feed',
          possibleTypes: [
            {
              name: 'GroupFeed',
            },
            {
              name: 'TripFeed',
            },
          ],
        },
      ],
    },
  },
});


export default new ApolloClient({ networkInterface, fragmentMatcher: feedFragmentMatcher });
