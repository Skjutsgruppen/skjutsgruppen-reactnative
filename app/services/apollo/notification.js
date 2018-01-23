import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NOTIFICATION_FETCH_LIMIT } from '@config/constant';

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
      avatar
    }
    Receiver{
      id
      firstName
    }
    notifiable
    Notifiable {
      ... on Trip {
        id
        tripType:type
        description
        seats
        parentId
        User {
          id
          email
          firstName
          lastName
          avatar
          relation {
            id
            email 
            firstName
            avatar
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
        mapPhoto
        totalComments
        isParticipant
        duration
        ReturnTrip {
          id
          date
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
        }
        Recurring {
          id
          date
        }
      }
      ... on Group {
        id
        outreach
        name
        description
        type
        photo
        mapPhoto
        User {
          id
          email
          firstName
          lastName
          avatar
          relation {
            id
            email
            firstName
            lastName
            avatar
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
        GroupMembers {
          id
        }
        GroupMembershipRequests{
          id
          status
          Member {
            id
            email
            firstName
          }
        }
      }
      ... on GroupMembershipRequest {
        id
        gmrStatus:status
        Group {
          id
          name
          description
          type
          photo
          mapPhoto
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              firstName
              avatar
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
      ... on FriendRequest {
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
      ... on Experience {
        id
        createdAt
        description
        photo
        Participants {
          User {
            id 
            email 
            firstName 
            lastName 
            avatar 
          } 
          status
        }
        Trip {
          id 
          type 
          description 
          seats 
          parentId
          User {
            id 
            email 
            firstName 
            lastName 
            avatar 
            relation {
              id 
              email 
              firstName
              lastName
              avatar
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
          mapPhoto
          totalComments
          isParticipant
          duration
          ReturnTrip {
            id
            date
            TripStart {
              name
              coordinates
            }
            TripEnd {
              name
              coordinates
            }
          }
          Recurring {
            id
            date
          }
        }
        User {
          id 
          firstName 
          lastName 
          email 
          avatar 
        } 
        totalComments
      }
    }
    read
    createdAt
  }
}
`;

const NOTIFICATION_QUERY = gql`
query  notifications ($filters: NotificationFilterEnum, $offset: Int, $limit: Int) {
  notifications (filters:$filters, offset:$offset, limit:$limit) {
    rows {
      id
      User {
        id
        firstName
        lastName
        email
        avatar
      }
      Receiver{
        id
        firstName
      }
      type
      notifiable
      Notifiable {
        ... on Trip {
          id
          tripType:type
          description
          seats
          parentId
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              email 
              firstName
              avatar
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
          mapPhoto
          totalComments
          isParticipant
          duration
          ReturnTrip {
            id
            date
            TripStart {
              name
              coordinates
            }
            TripEnd {
              name
              coordinates
            }
          }
          Recurring {
            id
            date
          }
        }
        ... on Group {
          id
          outreach
          name
          description
          type
          photo
          mapPhoto
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              email
              firstName
              lastName
              avatar
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
          GroupMembers {
            id
          }
          GroupMembershipRequests{
            id
            status
            Member {
              id
              email
              firstName
            }
          }
        }
        ... on GroupMembershipRequest {
          id
          gmrStatus:status
          Group {
            id
            name
            description
            type
            photo
            mapPhoto
            User {
              id
              email
              firstName
              lastName
              avatar
              relation {
                id
                firstName
                avatar
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
        ... on FriendRequest {
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
        ... on Experience {
          id
          createdAt
          description
          photo
          Participants {
            User {
              id 
              email 
              firstName 
              lastName 
              avatar 
            } 
            status
          }
          Trip {
            id 
            type 
            description 
            seats 
            parentId
            User {
              id 
              email 
              firstName 
              lastName 
              avatar 
              relation {
                id 
                email 
                firstName
                lastName
                avatar
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
            mapPhoto
            totalComments
            isParticipant
            duration
            ReturnTrip {
              id
              date
              TripStart {
                name
                coordinates
              }
              TripEnd {
                name
                coordinates
              }
            }
            Recurring {
              id
              date
            }
          }
          User {
            id 
            firstName 
            lastName 
            email 
            avatar 
          } 
          totalComments
        }
      }
      read
      createdAt
    }
    count
  }
}
`;

export const withNotification = graphql(NOTIFICATION_QUERY, {
  options: ({ filters, offset = 0, limit = NOTIFICATION_FETCH_LIMIT }) => ({
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
    markRead: id => mutate(
      {
        variables: { id },
        update: (store) => {
          const oldNotificationsData = store.readQuery({ query: NOTIFICATION_QUERY, variables: { filters: 'old', offset: 0, limit: NOTIFICATION_FETCH_LIMIT } });
          const newNotificationsData = store.readQuery({ query: NOTIFICATION_QUERY, variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT } });
          let rows = [];

          rows = newNotificationsData.notifications.rows.filter((notification) => {
            if (notification.id === id) {
              oldNotificationsData.notifications.rows.push(notification);
              oldNotificationsData.notifications.count += 1;

              return null;
            }

            return notification;
          });

          newNotificationsData.notifications.rows = rows;
          newNotificationsData.notifications.count -= 1;

          store.writeQuery({ query: NOTIFICATION_QUERY, variables: { filters: 'old', offset: 0, limit: NOTIFICATION_FETCH_LIMIT }, data: oldNotificationsData });
          store.writeQuery({ query: NOTIFICATION_QUERY, variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT }, data: newNotificationsData });
        },
      }),
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

const NOTIFICATION_SEARCH_QUERY = gql`
query searchMessages ($keyword: String, $offset: Int, $limit: Int) {
  searchMessages (keyword: $keyword, offset:$offset, limit:$limit) {
    rows {
      id
      User {
        id
        firstName
        lastName
        email
        avatar
      }
      Receiver{
        id
        firstName
      }
      type
      notifiable
      Notifiable {
        ... on Trip {
          id
          tripType:type
          description
          seats
          parentId
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              email 
              firstName
              avatar
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
          mapPhoto
          totalComments
          isParticipant
          duration
          ReturnTrip {
            id
            date
            TripStart {
              name
              coordinates
            }
            TripEnd {
              name
              coordinates
            }
          }
          Recurring {
            id
            date
          }
        }
        ... on Group {
          id
          outreach
          name
          description
          type
          photo
          mapPhoto
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              email
              firstName
              lastName
              avatar
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
            avatar
          }
          GroupMembershipRequests{
            id
            status
            Member {
              id
              email
              firstName
            }
          }
        }
        ... on GroupMembershipRequest {
          id
          gmrStatus:status
          Group {
            id
            name
            description
            type
            photo
            mapPhoto
            User {
              id
              email
              firstName
              lastName
              avatar
              relation {
                id
                firstName
                avatar
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
        ... on FriendRequest {
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
        ... on Experience {
          id
          createdAt
          description
          photo
          Participants {
            User {
              id 
              email 
              firstName 
              lastName 
              avatar 
            } 
            status
          }
          Trip {
            id 
            type 
            description 
            seats 
            parentId
            User {
              id 
              email 
              firstName 
              lastName 
              avatar 
              relation {
                id 
                email 
                firstName
                lastName
                avatar
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
            mapPhoto
            totalComments
            isParticipant
            duration
            ReturnTrip {
              id
              date
              TripStart {
                name
                coordinates
              }
              TripEnd {
                name
                coordinates
              }
            }
            Recurring {
              id
              date
            }
          }
          User {
            id 
            firstName 
            lastName 
            email 
            avatar 
          } 
          totalComments
        }
      }
      read
      createdAt
    }
    count
  }
}
`;

export const withNotificationSearch = graphql(NOTIFICATION_SEARCH_QUERY, {
  options: ({ keyword, offset = 0, limit = NOTIFICATION_FETCH_LIMIT }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { keyword, offset, limit },
  }),
  props: ({
    data: { loading, searchMessages, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (searchMessages) {
      rows = searchMessages.rows;
      count = searchMessages.count;
    }

    return {
      searchMessages: {
        loading, rows, count, fetchMore, refetch, subscribeToMore, networkStatus, error,
      },
    };
  },
});
