import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { InteractionManager, Platform, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

const SYNC_CONTACTS = gql`
mutation syncContacts($contactList:[ContactsInput]) {
    sync(contactList:$contactList)
}
`;

const getMappedContacts = () => {
  const contactList = [];

  return new Promise((resolve) => {
    Contacts.getAll(async (error, contacts) => {
      if (error === 'denied') {
        resolve(contactList);
      }

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

      resolve(contactList);
    });
  });
};

export const withContactSync = graphql(SYNC_CONTACTS, {
  props: ({ mutate }) => ({
    syncContacts: async () => {
      try {
        let contactList = [];

        if (Platform === 'android' || Platform.OS === 'android') {
          const permissions =
            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

          if (!permissions) {
            const response =
              await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
            if (response && response === 'granted') {
              contactList = await getMappedContacts();
            }

            mutate({ variables: { contactList } });

            return;
          }

          contactList = await getMappedContacts();
          mutate({ variables: { contactList } });

          return;
        }

        InteractionManager.runAfterInteractions(() => {
          Contacts.checkPermission(async (err, permission) => {
            if (err || permission !== 'authorized') {
              Contacts.requestPermission(async (contactErr, res) => {
                if (contactErr) {
                  if (Platform === 'ios' || Platform.OS === 'ios') {
                    // Crashlytics.recordError(contactErr);
                  }
                }

                if (res === 'authorized') {
                  contactList = await getMappedContacts();
                }

                mutate({ variables: { contactList } });
              });

              return;
            }

            contactList = await getMappedContacts();

            mutate({ variables: { contactList } });
          });
        });
      } catch (err) {
        console.warn(err);
      }
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
      fetchPolicy: 'cache-and-network',
    }),
  props: ({ data: { contacts, loading, networkStatus } }) => ({
    contacts: { rows: contacts, loading, networkStatus },
  }),
});
