import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NOTIFICATION_FETCH_LIMIT } from '@config/constant';
import { updateNewNotificationToOld, updateActiveRides, updateActiveGroups } from '@services/apollo/dataSync';

const NOTIFICATION_SUBSCRIPTION = gql`
subscription notification($userId: Int!) {
  notification(userId: $userId ){
    id
    ids
    notifiable
    createdAt
    Notifications {
      type
    }
    Notifiers {
      id
      firstName
      avatar
    }
    Notifiable {
      ... on Trip {
        id
        TripStart {
          name 
        } 
        TripEnd {
          name 
        } 
        muted
        unreadNotificationCount
      }
      ... on Group {
        id
        name
        membershipStatus
        User {
          id
        }
        Enablers {
          id
          firstName
          avatar
        }
        muted
        unreadNotificationCount
      }
      ... on GroupMembershipRequest {
        id
        gmrStatus:status
        Group {
          id
          name
          membershipStatus
          User {
            id
          }
          muted
          unreadNotificationCount
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
        photoUrl
        publishedStatus
        Trip{
          id
          date
          TripStart {
            name
          }
          TripEnd {
            name
          }
          Stops {
            name
          }
          muted
          unreadNotificationCount
        }
        userStatus
        User {
          id 
          firstName 
          avatar 
        }
        Participants {
          User {
            id
            firstName
            avatar
          }
          status
        }
      }
    }
  }
}
`;

export const NOTIFICATION_QUERY = gql`
query  notifications ($filters: NotificationFilterEnum, $offset: Int, $limit: Int) {
  notifications (filters:$filters, offset:$offset, limit:$limit) {
    rows {
      id
      ids
      notifiable
      createdAt
      Notifications {
        type
      }
      Notifiers {
        id
        firstName
        avatar
      }
      Notifiable {
        ... on Trip {
          id
          TripStart {
            name 
          } 
          TripEnd {
            name 
          } 
          muted
          unreadNotificationCount
        }
        ... on Group {
          id
          name
          membershipStatus
          User {
            id
          }
          Enablers {
            id
            firstName
            avatar
          }
          muted
          unreadNotificationCount
        }
        ... on GroupMembershipRequest {
          id
          gmrStatus:status
          Group {
            id
            name
            membershipStatus
            User {
              id
            }
            muted
            unreadNotificationCount
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
          photoUrl
          publishedStatus
          Trip{
            id
            date
            TripStart {
              name
            }
            TripEnd {
              name
            }
            Stops {
              name
            }
            muted
            unreadNotificationCount
          }
          userStatus
          User {
            id 
            firstName 
            avatar 
          }
          Participants {
            User {
              id
              firstName
              avatar
            }
            status
          }
        }
      }
    }
    count
  }
}
`;

export const withNotification = graphql(NOTIFICATION_QUERY, {
  options: ({ filters, offset = 0, limit = NOTIFICATION_FETCH_LIMIT }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { filters, offset, limit },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data:
    {
      loading,
      notifications,
      fetchMore,
      refetch,
      subscribeToMore,
      networkStatus,
      error,
      startPolling,
    },
  }) => {
    let rows = [];
    let count = 0;

    if (notifications) {
      rows = notifications.rows;
      count = notifications.count;
    }

    return {
      notifications: {
        loading,
        rows,
        count,
        fetchMore,
        refetch,
        subscribeToMore,
        networkStatus,
        error,
        startPolling,
      },
      subscribeToNotification: param => subscribeToMore({
        document: NOTIFICATION_SUBSCRIPTION,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          let newRows = prev.notifications.rows;
          let exists = false;

          const newNotification = subscriptionData.data.notification;

          if (newNotification.notifiable === 'Trip') {
            if (newNotification.Notifiable.muted) {
              exists = true;
              updateActiveRides(newNotification.Notifiable);
            } else {
              newRows = prev.notifications.rows.map((row) => {
                if (row.Notifiable.id === newNotification.Notifiable.id) {
                  const Notifiers = row.Notifiers.concat(newNotification.Notifiers);
                  const ids = row.ids.concat(newNotification.ids);
                  let found = false;

                  exists = true;

                  row.Notifiers.forEach((r) => {
                    if (r.id === newNotification.Notifiers[0].id) {
                      found = true;
                    }
                  });

                  if (found) {
                    return { ...row, ids };
                  }

                  return { ...row, Notifiers, ids };
                }

                return row;
              });
            }
          } else if (newNotification.notifiable === 'Group') {
            if (newNotification.Notifiable.muted) {
              exists = true;
              updateActiveGroups(newNotification.Notifiable);
            } else {
              newRows = prev.notifications.rows.map((row) => {
                if (row.Notifiable.id === newNotification.Notifiable.id) {
                  const Notifiers = row.Notifiers.concat(newNotification.Notifiers);
                  const ids = row.ids.concat(newNotification.ids);
                  let found = false;

                  exists = true;

                  row.Notifiers.forEach((r) => {
                    if (r.id === newNotification.Notifiers[0].id) {
                      found = true;
                    }
                  });

                  if (found) {
                    return { ...row, ids };
                  }

                  return { ...row, Notifiers, ids };
                }

                return row;
              });
            }
          } else if (newNotification.notifiable === 'Experience') {
            if (newNotification.Notifiable.Trip.muted) {
              exists = true;
              updateActiveRides(newNotification.Notifiaidsble.Trip);
            }
          } else if (newNotification.notifiable === 'GroupMembershipRequest') {
            if (newNotification.Notifiable.Group.muted) {
              exists = true;
              updateActiveGroups(newNotification.Notifiable.Group);
            }
          }

          if (exists) {
            return {
              notifications: {
                ...prev.notifications,
                ...{ rows: newRows, count: prev.notifications.count },
              },
            };
          }

          newRows = [newNotification].concat(prev.notifications.rows);

          return {
            notifications: {
              ...prev.notifications,
              ...{ rows: newRows, count: prev.notifications.count + 1 },
            },
          };
        },
      }),
    };
  },
});


const READ_NOTIFICATION_QUERY = gql`
mutation readNotification($ids:[Int]!) {
  readNotification(ids:$ids)
}
`;

export const withReadNotification = graphql(READ_NOTIFICATION_QUERY, {
  props: ({ mutate }) => ({
    markRead: (id, ids) => mutate(
      {
        variables: { ids },
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
mutation acceptGroupRequest($id:[Int]!) {
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
          totalFeeds
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
          Enablers {
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
          isAdmin
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
            isAdmin
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
          photoUrl
          publishedStatus
          Trip{
            id
          }
          userStatus
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
    fetchPolicy: 'cache-and-network',
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
