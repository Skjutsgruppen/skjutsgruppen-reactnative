import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const DELETE_FEED_QUERY = gql`
 mutation deleteFeed($id: Int!){
  deleteFeed(id: $id)
 }
`;

export const withDeleteFeed = graphql(DELETE_FEED_QUERY, {
  props: ({ mutate }) => (
    {
      deleteFeed: ({ id }) => mutate({ variables: { id } }),
    }),
});
