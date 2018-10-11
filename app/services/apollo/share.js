import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LOCATION_SHARED_TO_ALL_RESOURCES_QUERY } from '@services/apollo/notification';
import { NOTIFICATION_FETCH_LIMIT } from '@config/constant';

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
  shareLocation(point :$point, duration :$duration, users :$users, groupId:$groupId, tripId:$tripId) {
    Location {
      id
      url
    }
  }
}
`;

export const withShareLocation = graphql(SHARE_LOCATION_QUERY, {
  props: ({ mutate }) => ({
    shareLocation: ({ point, duration, users = [], groupId = null, tripId = null }) =>
      mutate({
        variables: { point, duration, users, groupId, tripId },
        refetchQueries: [
          {
            query: LOCATION_SHARED_TO_ALL_RESOURCES_QUERY,
            variables: { offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
          },
        ],
      }),
  }),
});

export const LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY = gql`
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
    isLive
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
    isLive
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

            if (subscriptionData.data.locationShared.User.id === userId) return prev;

            const filtered = prev.locationSharedToSpecificResource
              .filter(l => l.id !== subscriptionData.data.locationShared.id);

            if (subscriptionData.data.locationShared.isLive) {
              return {
                locationSharedToSpecificResource: filtered
                  .concat(subscriptionData.data.locationShared),
              };
            }

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
        refetchQueries: [
          {
            query: LOCATION_SHARED_TO_ALL_RESOURCES_QUERY,
            variables: { offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
          },
        ],
      }),
  }),
});

const EMBED_MUTATION = gql`
  mutation embed($tripId: Int, $groupId: Int){
    embed(tripId: $tripId, groupId: $groupId)
  }
`;

export const withEmbed = graphql(EMBED_MUTATION, {
  props: ({ mutate }) => (
    {
      embed: ({ tripId, groupId }) => mutate({ variables: { tripId, groupId } }),
    }),
});

