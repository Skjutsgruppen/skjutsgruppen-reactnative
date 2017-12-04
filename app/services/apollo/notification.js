import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NOTIFICATION_SUBSCRIPTION = gql`
subscription notification($userId: Int!) {
  notification(userId: $userId ){
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
`;

const NOTIFICATION_QUERY = gql`
query  notifications ($filters: NotificationFilterEnum, $offset: Int, $limit: Int) {
  notifications (filters:$filters, offset:$offset, limit:$limit) {
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
    count
  }
}
`;

export const withNotification = graphql(NOTIFICATION_QUERY, {
  options: ({ filters, offset = 0, limit = 5 }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { filters, offset, limit },
  }),
  props: ({
    data: { loading, notifications, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (notifications) {
      rows = notifications.rows;
      count = notifications.count;
    }

    return {
      notifications: {
        loading, rows, count, fetchMore, refetch, subscribeToMore, networkStatus, error,
      },
      subscribeToNotification: param => subscribeToMore({
        document: NOTIFICATION_SUBSCRIPTION,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newNotification = subscriptionData.data.notification;
          const newrows = [newNotification].concat(prev.notifications.rows);
          return {
            notifications: {
              ...prev.notifications,
              ...{ rows: newrows, count: prev.notifications.count + 1 },
            },
          };
        },
      }),
    };
  },
});


const READ_NOTIFICATION_QUERY = gql`
mutation readNotification($id:Int!) {
  readNotification(id:$id)
}
`;

export const withReadNotification = graphql(READ_NOTIFICATION_QUERY, {
  props: ({ mutate }) => ({
    markRead: id => mutate({ variables: { id } }),
  }),
});


const REJECT_GROUP_INVITATION_QUERY = gql`
mutation rejectGroupInvitation($id:Int!) {
  rejectGroupInvitation(id:$id)
}
`;

export const withRejectGroupInvitation = graphql(REJECT_GROUP_INVITATION_QUERY, {
  props: ({ mutate }) => ({
    rejectGroupInvitation: id => mutate({ variables: { id } }),
  }),
});


const ACCEPT_GROUP_REQUEST_QUERY = gql`
mutation acceptGroupRequest($id:Int!) {
  acceptGroupRequest(id:$id)
}
`;

export const withAcceptGroupRequest = graphql(ACCEPT_GROUP_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    acceptGroupRequest: id => mutate({ variables: { id } }),
  }),
});


const ACCEPT_GROUP_INVITATION_QUERY = gql`
mutation acceptGroupInvitation($id:Int!) {
  acceptGroupInvitation(id:$id)
}
`;

export const withAcceptGroupInvitation = graphql(ACCEPT_GROUP_INVITATION_QUERY, {
  props: ({ mutate }) => ({
    acceptGroupInvitation: id => mutate({ variables: { id } }),
  }),
});


const LEAVE_GROUP_QUERY = gql`
mutation leaveGroup($id:Int!) {
  leaveGroup(id:$id)
}
`;

export const withLeaveGroup = graphql(LEAVE_GROUP_QUERY, {
  props: ({ mutate }) => ({
    leaveGroup: id => mutate({ variables: { id } }),
  }),
});
