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
      isSupporter
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
        direction
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
          isSupporter
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
          Enablers {
            id
            firstName
            avatar
            isSupporter
            deleted
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
          isSupporter
        }
        Participants {
          User {
            id
            firstName
            avatar
            isSupporter
          }
          status
        }
      }
      ... on Location {
        id
        Trip {
          id
          TripStart {
            name
          }
          TripEnd {
            name
          }
          muted
          unreadNotificationCount
          direction
        }
        Group {
          id
          outreach
          name
          membershipStatus
          User {
            id
          }
          Enablers {
            id
            firstName
            avatar
            isSupporter
          }
          muted
          unreadNotificationCount
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
        isSupporter
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
          direction
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
            isSupporter
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
            Enablers {
              id
              firstName
              avatar
              isSupporter
              deleted
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
            isSupporter
          }
          Participants {
            User {
              id
              firstName
              avatar
              isSupporter
            }
            status
          }
        }
        ... on Location {
          id
          Trip {
            id
            TripStart {
              name
            }
            TripEnd {
              name
            }
            muted
            unreadNotificationCount
            direction
          }
          Group {
            id
            outreach
            name
            membershipStatus
            User {
              id
            }
            Enablers {
              id
              firstName
              avatar
              isSupporter
            }
            muted
            unreadNotificationCount
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
              updateActiveRides(newNotification.Notifiable.Trip);
            }
          } else if (newNotification.notifiable === 'GroupMembershipRequest') {
            if (newNotification.Notifiable.Group.muted) {
              exists = true;
              updateActiveGroups(newNotification.Notifiable.Group);
            }
          } else if (newNotification.notifiable === 'Location') {
            if (newNotification.Notifiable.Group.id && newNotification.Notifiable.Group.muted) {
              exists = true;
              updateActiveGroups(newNotification.Notifiable.Group);
            } else {
              exists = true;
              updateActiveRides(newNotification.Notifiable.Trip);
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


const UNREAD_NOTIFICATION_QUERY = gql`
query unreadNotifications {
  unreadNotifications
}
`;

export const withUnreadNotification = graphql(UNREAD_NOTIFICATION_QUERY, {
  options: () => ({
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { unreadNotifications, loading } }) => ({ unreadNotifications, loading }),
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
        refetchQueries: [
          {
            query: UNREAD_NOTIFICATION_QUERY,
          },
        ],
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
        isSupporter
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
            isSupporter
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
            isSupporter
          }
          Enablers {
            id
            firstName
            avatar
            isSupporter
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
              isSupporter
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
            Enablers {
              id
              firstName
              avatar
              isSupporter
              deleted
            }
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
            isSupporter
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

export const LOCATION_SHARED_TO_ALL_RESOURCES_QUERY = gql`
query locationSharedToAllResources($offset: Int, $limit: Int) {
  locationSharedToAllResources(offset: $offset, limit: $limit) {
    rows {
      id
      User {
        id
        firstName
        avatar
        isSupporter
        deleted
      }
      Group {
        id
        name
        photo
        outreach
      }
      Trip {
        id
        direction
        TripStart {
          name
        }
        TripEnd {
          name
        }
        User {
          id
          avatar
          isSupporter
        }
      }
      users
      interval
      duration
      timeFraction
    }
    count
  }
}
`;

export const withLocationSharedToAllResources = graphql(LOCATION_SHARED_TO_ALL_RESOURCES_QUERY, {
  options: ({ offset = 0, limit = NOTIFICATION_FETCH_LIMIT }) => ({
    variables: { offset, limit },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    data: {
      loading,
      locationSharedToAllResources,
      error,
      networkStatus,
      refetch,
      fetchMore,
      subscribeToMore,
    },
  }) => ({
    locationSharedToAllResources: {
      loading,
      rows: locationSharedToAllResources ? locationSharedToAllResources.rows : [],
      count: locationSharedToAllResources ? locationSharedToAllResources.count : 0,
      error,
      networkStatus,
      refetch,
      fetchMore,
      subscribeToMore,
    },
  }),
})
  ;
