import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NOTIFICATION_QUERY = gql`
query  {
  notifications {
    rows {
      id
      type
      User {
        id
        firstName
        lastName
        email
        photo
      }
      Receiver{
        id
        firstName
      }
      Trip {
        id
        type
        description
        seats
        User {
          id
          email
          firstName
          lastName
          photo
          relation {
            id,
            email,
            firstName
            photo
          }
        }
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
        Stops {
          name
          coordinates
        }
        date
        time
        photo
        returnTrip
      }
      Group {
        id
        outreach
        name
        description
        type
        photo
        User {
          id
          email
          firstName
          lastName
          photo
          relation {
            id,
            email,
            firstName
            photo
          }
        }
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
        Stops {
          name
          coordinates
        }
        country
        county
        municipality
        locality
        GroupMembers{
          id
        }
      }
      read
      createdAt
      GroupMembershipRequest {
        id
        status
        Group {
          id
          name
          description
          type
          photo
          User {
            id
            email
            firstName
            lastName
            photo
            relation {
              id,
              email,
              firstName
              photo
            }
          }
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          country
          county
          municipality
          locality
          GroupMembers{
            id
          }
        }
      }
      FriendRequest {
        id
        status
        User {
          id
          firstName
        }
        FutureFriend{
          id
          firstName
        }
      }
    }
  }
}
`;


export const withNotification = graphql(NOTIFICATION_QUERY, {
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: 0, limit: 10 },
  },
  props: ({ data: { loading, notifications, fetchMore, refetch, networkStatus, error } }) => {
    let rows = [];
    let count = 0;

    if (notifications) {
      rows = notifications.rows;
      count = notifications.count;
    }

    return { notification: { loading, rows, count, fetchMore, refetch, networkStatus, error } };
  },
});

const READ_NOTIFICATION_QUERY = gql`
query notifications($id:Int!) {
  notifications(id:$id)
}
`;

export const withReadNotification = graphql(READ_NOTIFICATION_QUERY, {
  options: ({ id }) => ({ variables: { id } }),
  props: ({ data }) => ({ data }),
});

const REJECT_GROUP_NOTIFICATION_QUERY = gql`
query rejectGroupInvitation($id:Int!) {
  rejectGroupInvitation(id:$id)
}
`;

export const withRejectGroupNotification = graphql(REJECT_GROUP_NOTIFICATION_QUERY, {
  options: ({ id }) => ({ variables: { id } }),
  props: ({ data }) => ({ data }),
});

const ACCEPT_GROUP_REQUEST_QUERY = gql`
query acceptGroupRequest($id:Int!) {
  acceptGroupRequest(id:$id)
}
`;

export const withAcceptGroupRequest = graphql(ACCEPT_GROUP_REQUEST_QUERY, {
  options: ({ id }) => ({ variables: { id } }),
  props: ({ data }) => ({ data }),
});
