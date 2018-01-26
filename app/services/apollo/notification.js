import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NOTIFICATION_FETCH_LIMIT, NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED } from '@config/constant';
import {
  increaseProfileFriendsCount,
  increaseProfileFriend,
  updateNewNotificationToOld,
} from '@services/apollo/dataSync';

const NOTIFICATION_SUBSCRIPTION = gql`
subscription notification($userId: Int!) {
  notification(userId: $userId ){
    id
    type
    User {
      id
      firstName
      avatar
      phoneNumber
      email
    }
    notifiable
    Notifiable {
      ... on Trip {
        id 
        tripType:type 
        description 
        seats 
        User {
          id 
          firstName 
          avatar 
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
        photo 
        mapPhoto
        totalComments
        isParticipant
      }
      ... on Group {
        id
        name
        description
        User {
          id 
          firstName 
          avatar 
        } 
        outreach
        type
        photo
        mapPhoto
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
        membershipStatus
        totalParticipants
      }
      ... on GroupMembershipRequest {
        id
        gmrStatus:status
        Group {
          id
          name
          description
          User {
            id 
            firstName 
            avatar 
          } 
          outreach
          type
          photo
          mapPhoto
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
          membershipStatus
          totalParticipants
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
        User {
          id 
          firstName 
          avatar 
        } 
      }
    }
    read
    createdAt
  }
}
`;

export const NOTIFICATION_QUERY = gql`
query  notifications ($filters: NotificationFilterEnum, $offset: Int, $limit: Int) {
  notifications (filters:$filters, offset:$offset, limit:$limit) {
    rows {
      id
      type
      User {
        id
        firstName
        avatar
        phoneNumber
        email
      }
      notifiable
      Notifiable {
        ... on Trip {
          id 
          tripType:type 
          description 
          seats 
          User {
            id 
            firstName 
            avatar 
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
          photo 
          mapPhoto
          totalComments
          isParticipant
        }
        ... on Group {
          id
          name
          description
          User {
            id 
            firstName 
            avatar 
          } 
          outreach
          type
          photo
          mapPhoto
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
          membershipStatus 
          totalParticipants
        }
        ... on GroupMembershipRequest {
          id
          gmrStatus:status
          Group {
            id
            name
            description
            User {
              id 
              firstName 
              avatar 
            } 
            outreach
            type
            photo
            mapPhoto
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
            membershipStatus
            totalParticipants
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
          User {
            id 
            firstName 
            avatar 
          } 
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

          if (newNotification.type === NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPTED) {
            increaseProfileFriendsCount(param.userId);
            increaseProfileFriend(param.userId, newNotification.User);
          }

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
          updateNewNotificationToOld(id, store);
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
      type
      User {
        id
        firstName
        avatar
      }
      notifiable
      Notifiable {
        ... on Trip {
          id 
          tripType:type 
          description 
          seats 
          User {
            id 
            firstName 
            avatar 
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
          photo 
          mapPhoto
          totalComments
          isParticipant
        }
        ... on Group {
          id
          name
          description
          User {
            id 
            firstName 
            avatar 
          } 
          outreach
          type
          photo
          mapPhoto
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
          membershipStatus
          totalParticipants
          } 
        ... on GroupMembershipRequest {
          id
          gmrStatus:status
          Group {
            id
            name
            description
            User {
              id 
              firstName 
              avatar 
            } 
            outreach
            type
            photo
            mapPhoto
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
            membershipStatus
            totalParticipants
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
          User {
            id 
            firstName 
            avatar 
          } 
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
