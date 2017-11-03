import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SYNC_CONTACTS = gql`
mutation syncContacts($contactList:[String]) {
    sync(contactList:$contactList)
}
`;

export const withContacts = graphql(SYNC_CONTACTS, {
  props: ({ mutate }) => ({
    syncContacts: contactList => mutate({ variables: { contactList } }),
  }),
});
