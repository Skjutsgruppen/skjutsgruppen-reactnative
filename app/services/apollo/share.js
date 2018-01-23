import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SHARE_QUERY = gql`
mutation share($id: Int!, $type: InputShareTypeEnum!, $share: ShareInput!) {
  share(id :$id, type :$type, share :$share)
}
`;

export const withShare = graphql(SHARE_QUERY, {
  props: ({ mutate }) => ({
    share: ({ id, type, share }) => mutate({ variables: { id, type, share } }),
  }),
});

