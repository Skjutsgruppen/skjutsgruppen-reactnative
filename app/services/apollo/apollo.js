import ApolloClient, { createNetworkInterface, IntrospectionFragmentMatcher } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { API_URL, WS_API_URL } from '@config';
import Auth from '@services/auth';

const wsClient = new SubscriptionClient(WS_API_URL, {
  reconnect: true,
  lazy: true,
});

wsClient.use([{
  async applyMiddleware(req, next) {
    wsClient.connectionParams.authToken = await Auth.getToken();
    next();
  },
}]);


const networkInterface = createNetworkInterface({ uri: API_URL });

networkInterface.use([{
  async applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    const token = await Auth.getToken();
    req.options.headers.authorization = token;
    next();
  },
}]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

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
            {
              name: 'CommentFeed',
            },
            {
              name: 'ExperienceFeed',
            },
            {
              name: 'NewsFeed',
            },
          ],
        },
      ],
    },
  },
});


export default new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  fragmentMatcher: feedFragmentMatcher,
});
