import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { API_URL, WS_API_URL } from '@config';
import Auth from '@services/auth';
import { ReduxCache } from 'apollo-cache-redux';
import configureStore from '@redux/store';

const httpLink = createHttpLink({
  uri: API_URL,
});

const wsLink = new WebSocketLink({
  uri: WS_API_URL,
  options: {
    reconnect: true,
  },
});

const middlewareLink = setContext(() => ({
  headers: { authorization: Auth.getToken() || null },
}));

const httpLinkWithMiddleware = middlewareLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithMiddleware,
);

const cache = new ReduxCache({
  store: configureStore({}),
  fragmentMatcher: new IntrospectionFragmentMatcher({
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
  }),
});

export default new ApolloClient({
  link,
  cache,
});
