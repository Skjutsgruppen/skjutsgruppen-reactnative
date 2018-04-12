import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SHARE_QUERY = gql`
mutation share($id: Int!, $type: InputShareTypeEnum!, $share: ShareInput!) {
  share(id :$id, type :$type, share :$share)
}
`;

export const withShare = graphql(SHARE_QUERY, {
  props: ({ mutate }) => ({
    share: ({ id, type, share }) => mutate({ variables: { id, type, share } }),
  }),
});

const SHARE_LOCATION_QUERY = gql`
mutation shareLocation($point: [Float]!, $duration: Int!, $users: [Int], $groupId: Int, $tripId: Int) {
  shareLocation(point :$point, duration :$duration, users :$users, groupId:$groupId, tripId:$tripId)
}
`;

export const withShareLocation = graphql(SHARE_LOCATION_QUERY, {
  props: ({ mutate }) => ({
    shareLocation: ({ point, duration, users = [], groupId = null, tripId = null }) =>
      mutate({ variables: { point, duration, users, groupId, tripId } }),
  }),
});

const LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY = gql`
query locationSharedToSpecificResource($resourceId: Int!, $resourceType: ShareableEnum!) {
  locationSharedToSpecificResource(resourceId: $resourceId, resourceType: $resourceType) {
    id
    User {
      id
      firstName
      avatar
      deleted
    }
    locationCoordinates
    sharedFrom
    sharedTo
    users
    interval
    duration
    timeFraction
  }
}
`;

const LOCATION_SHARED_SUBSCRIPTION = gql`
subscription onLocationShared($userId: Int!, $tripId: Int, $groupId: Int) {
  locationShared(userId: $userId, tripId: $tripId, groupId: $groupId) {
    id
    User {
      id
      firstName
      avatar
      deleted
    }
    locationCoordinates
    sharedFrom
    sharedTo
    users
    interval
    duration
    timeFraction
  }
}
`;

export const withLocationSharedToSpecificResource = graphql(
  LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY, {
    options: ({ resourceId, resourceType }) => ({
      variables: { resourceId, resourceType },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({
      data: {
        loading,
        locationSharedToSpecificResource,
        error,
        networkStatus,
        refetch,
        fetchMore,
        subscribeToMore,
      },
    }) => ({
      locationSharedToSpecificResource: {
        loading,
        data: locationSharedToSpecificResource,
        error,
        networkStatus,
        refetch,
        fetchMore,
        subscribeToLocationShared: ({ userId, tripId, groupId }) => subscribeToMore({
          document: LOCATION_SHARED_SUBSCRIPTION,
          variables: { userId, tripId, groupId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            if (subscriptionData.data.locationShared.locationCoordinates) {
              if (subscriptionData.data.locationShared.User.id === userId) return prev;

              const newLocationSharedToSpecificResource = prev.locationSharedToSpecificResource
                .filter(l => l.id !== subscriptionData.data.locationShared.id);

              return {
                locationSharedToSpecificResource: newLocationSharedToSpecificResource
                  .concat(subscriptionData.data.locationShared),
              };
            }

            const filtered = prev.locationSharedToSpecificResource
              .filter(row => row.id !== subscriptionData.data.locationShared.id);

            return { locationSharedToSpecificResource: filtered };
          },
        }),
      },
    }),
  });

const STOP_SPECIFIC_QUERY = gql`
  mutation stopSpecific($id: Int!, $type: ShareableEnum!) {
    stopSpecific(id: $id, type: $type)
  }
  `;

export const withStopSpecific = graphql(STOP_SPECIFIC_QUERY, {
  props: ({ mutate }) => ({
    stopSpecific: ({ id, type }) =>
      mutate({
        variables: { id, type },
      }),
  }),
});
