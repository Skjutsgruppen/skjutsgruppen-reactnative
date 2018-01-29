import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
  }
}`;

export const withProfile = graphql(PROFILE_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    props: ({ data: { loading, profile = {}, refetch, networkStatus, error } }) => ({
      data: {
        loading, profile, refetch, networkStatus, error,
      },
    }),
  }),
});

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
  }
}`;

export const withAccount = graphql(ACCOUNT_QUERY, {
  props: ({ data: { loading, account = {}, refetch, networkStatus, error } }) => ({
    data: {
      loading, profile: account, refetch, networkStatus, error,
    },
  }),
});
