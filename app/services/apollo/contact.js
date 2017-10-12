import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const syncContactsQuery = gql`
mutation syncContacts($contactList:[String]) {
    sync(contactList:$contactList)
}
`;

export const withContacts = graphql(syncContactsQuery, {
  props: ({ mutate }) => ({
    syncContacts: contactList => mutate({ variables: { contactList } }),
  }),
});
