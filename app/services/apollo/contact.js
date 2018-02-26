import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { InteractionManager } from 'react-native';
import Contacts from 'react-native-contacts';

const SYNC_CONTACTS = gql`
mutation syncContacts($contactList:[ContactsInput]) {
    sync(contactList:$contactList)
}
`;

export const withContactSync = graphql(SYNC_CONTACTS, {
  props: ({ mutate }) => ({
    syncContacts: () => {
      InteractionManager.runAfterInteractions(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            console.warn(err);
          } else {
            const contactList = [];
            contacts.forEach(
              (contact) => {
                if (contact.phoneNumbers.length > 0) {
                  const contactName = `${contact.givenName ? contact.givenName : ''}${contact.familyName ? ` ${contact.familyName}` : ''}`;

                  contact.phoneNumbers.forEach(phoneBook =>
                    contactList.push({
                      name: contactName,
                      phoneNumber: phoneBook.number,
                    }),
                  );
                }
              },
            );
            mutate({ variables: { contactList } });
          }
        });
      });
    },
  }),
});

const CONTACTS_QUERY = gql`
query contacts($limit: Int, $offset: Int) {
  contacts(limit: $limit, offset: $offset){
    name
    phoneNumber
  }
}
`;

export const withContactFriends = graphql(CONTACTS_QUERY, {
  options: ({
    offset = 0,
    limit = null,
  }) =>
    ({
      variables: { offset, limit },
      fetchPolicy: 'network-only',
    }),
  props: ({ data: { contacts, loading, networkStatus } }) => ({
    contacts: { rows: contacts, loading, networkStatus },
  }),
});
