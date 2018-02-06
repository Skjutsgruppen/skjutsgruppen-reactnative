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
      id
      firstName
      avatar
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
      id
      firstName
      avatar
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
    firstName
    lastName
    email
    phoneNumber
    emailVerified
    phoneVerified
    avatar
    fbId
    verificationCode
    phoneVerificationCode
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

export const ACCOUNT_QUERY = gql`
query account {
  account {
    id
    firstName
    lastName
    email
    phoneNumber
    emailVerified
    phoneVerified
    avatar
    fbId
    verificationCode
    phoneVerificationCode
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
  query conversations ($offset: Int, $limit: Int) {
    conversations (offset: $offset, limit: $limit) {
      rows {
        id
        text
        date
        Commentable{
          ... on Trip {
            id 
            type 
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
        }
      }
      count
    }
  }
`;

export const withConversation = graphql(CONVERSATION_QUERY, {
  options: ({ offset = 0, limit = CONVERSATION_FETCH_LIMIT }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { offset, limit },
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
