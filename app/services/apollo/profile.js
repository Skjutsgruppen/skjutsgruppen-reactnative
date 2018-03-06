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
    totalComments
    totalExperiences
    totalGroups
    totalFriends
    relationshipType 
    friendRequestId
    createdAt
    isSupporter
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
    totalComments
    totalExperiences
    totalGroups
    totalFriends
    relationshipType 
    friendRequestId
    createdAt
    isSupporter
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

const ACCOUNT_SUBSCRIPTION_QUERY = gql`
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
    totalComments
    totalExperiences
    totalGroups
    totalFriends
    fbId      
    createdAt
    isSupporter
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
    totalComments
    totalExperiences
    totalGroups
    totalFriends
    fbId      
    createdAt
    isSupporter
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
  query conversations ($queryString: String, $applyQueryString: Boolean,$offset: Int, $limit: Int) {
    conversations (queryString: $queryString, applyQueryString: $applyQueryString, offset: $offset, limit: $limit) {
      rows {
        id
        type 
        description 
        seats 
        User {
          id 
          firstName 
          avatar 
          relation {
            path{
              id
              firstName
              avatar
            }
            areFriends
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
        totalFeeds
        isParticipant
        experienceStatus
        ownerExperience {
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
    queryString = null,
    applyQueryString = false,
    offset = 0,
    limit = CONVERSATION_FETCH_LIMIT,
  }) =>
    ({
      notifyOnNetworkStatusChange: true,
      variables: {
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
