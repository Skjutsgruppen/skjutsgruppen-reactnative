import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CONVERSATION_FETCH_LIMIT } from '@config/constant';

const PROFILE_SUBSCRIPTION_QUERY = gql`
subscription updatedProfile($id: Int){
  updatedProfile (userId: $id){
    id
    firstName
    lastName
    avatar
    relation {
      path{
        id
        firstName
        avatar
      }
      areFriends
    }
    fbId
    totalOffered
    totalAsked
    totalRideConversations
    totalExperiences
    totalGroups
    totalFriends
    relationshipType
    friendRequestId
    createdAt
    isSupporter
    deleted
    twitterId
    agreementRead
    agreementAccepted
    contactSynced
  }
}`;

export const PROFILE_QUERY = gql`
query profile($id: Int){
  profile (id: $id){
    id
    firstName
    lastName
    avatar
    relation {
      path{
        id
        firstName
        avatar
      }
      areFriends
    }
    fbId
    totalOffered
    totalAsked
    totalRideConversations
    totalExperiences
    totalGroups
    totalFriends
    relationshipType
    friendRequestId
    createdAt
    isSupporter
    deleted
    twitterId
    agreementRead
    agreementAccepted
    contactSynced
  }
}`;

export const withProfile = graphql(PROFILE_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, profile, refetch, networkStatus, error, subscribeToMore } }) => ({
    data: {
      loading, profile, refetch, networkStatus, error, subscribeToMore,
    },
    subscribeToUpdatedProfile: param => subscribeToMore({
      document: PROFILE_SUBSCRIPTION_QUERY,
      variables: { id: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const { updatedProfile } = subscriptionData.data;

        return {
          profile: updatedProfile,
        };
      },
    }),
  }),
});

export const ACCOUNT_SUBSCRIPTION_QUERY = gql`
subscription updatedAccount($id: Int) {
  updatedAccount(userId: $id) {
    id
    email
    newEmail
    avatar
    phoneNumber
    newPhoneNumber
    firstName
    lastName
    emailVerified
    verificationCode
    phoneVerified
    totalOffered
    totalAsked
    totalRideConversations
    totalExperiences
    totalGroups
    totalFriends
    fbId
    createdAt
    isSupporter
    twitterId
    agreementRead
    agreementAccepted
    contactSynced
  }
}`;

export const ACCOUNT_QUERY = gql`
query account {
  account {
    id
    email
    newEmail
    avatar
    phoneNumber
    newPhoneNumber
    firstName
    lastName
    emailVerified
    verificationCode
    phoneVerified
    totalOffered
    totalAsked
    totalRideConversations
    totalExperiences
    totalGroups
    totalFriends
    fbId
    createdAt
    isSupporter
    twitterId
    agreementRead
    agreementAccepted
    contactSynced
  }
}`;

export const withAccount = graphql(ACCOUNT_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: (
    { data: { loading, account = {}, refetch, networkStatus, error, subscribeToMore } },
  ) => ({
    data: {
      loading, profile: account, refetch, networkStatus, error, subscribeToMore,
    },
    subscribeToUpdatedProfile: param => subscribeToMore({
      document: ACCOUNT_SUBSCRIPTION_QUERY,
      variables: { id: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const { updatedAccount } = subscriptionData.data;

        return {
          account: updatedAccount,
        };
      },
    }),
  }),
});

const CONVERSATION_QUERY = gql`
  query conversations ($id: Int, $queryString: String, $applyQueryString: Boolean,$offset: Int, $limit: Int) {
    conversations (id: $id, queryString: $queryString, applyQueryString: $applyQueryString, offset: $offset, limit: $limit) {
      rows {
        id
        type
        description
        seats
        User {
          id
          firstName
          avatar
          deleted
          relation {
            path{
              id
              firstName
              avatar
              deleted
            }
            areFriends
          }
        }
        direction
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
        totalFeeds
        isParticipant
        experienceStatus
        ownerExperience {
          id
          createdAt
          description
          photoUrl
          publishedStatus
          userStatus
          User {
            id
            firstName
            avatar
            deleted
          }
        }
        Participants{
          count
        }
      }
      count
    }
  }
`;

export const withConversation = graphql(CONVERSATION_QUERY, {
  options: ({
    id = null,
    queryString = null,
    applyQueryString = false,
    offset = 0,
    limit = CONVERSATION_FETCH_LIMIT,
  }) =>
    ({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        id,
        queryString,
        applyQueryString,
        offset,
        limit,
      },
    }),
  props: ({ data: { loading, conversations, refetch, networkStatus, fetchMore, error } }) => {
    let rows = [];
    let count = 0;

    if (conversations) {
      rows = conversations.rows;
      count = conversations.count;
    }

    return {
      conversations: { loading, rows, count, fetchMore, refetch, networkStatus, error },
    };
  },
});

const STORE_APP_TOKEN_QUERY = gql`
  mutation storeAppToken($token: String, $deviceId: String!){
    storeAppToken(token: $token, deviceId: $deviceId)
  }
`;

export const withStoreAppToken = graphql(STORE_APP_TOKEN_QUERY, {
  props: ({ mutate }) => ({
    storeAppToken: (token, deviceId) => mutate({ variables: { token, deviceId } }),
  }),
});

const DELETE_ACCOUNT_QUERY = gql`
mutation deleteAccount($id: Int) {
  deleteAccount(id: $id)
}`;

export const withDeleteAccount = graphql(DELETE_ACCOUNT_QUERY, {
  props: ({ mutate }) => ({
    deleteAccount: (id = null) => mutate({ variables: { id } }),
  }),
});

const REMOVE_APP_TOKEN_QUERY = gql`
  mutation removeAppToken($deviceId: String!){
    removeAppToken(deviceId: $deviceId)
  }
`;

export const withRemoveAppToken = graphql(REMOVE_APP_TOKEN_QUERY, {
  props: ({ mutate }) => ({
    removeAppToken: deviceId => mutate({ variables: { deviceId } }),
  }),
});

