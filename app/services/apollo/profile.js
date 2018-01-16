import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PROFILE_QUERY = gql`
query profile($id: Int){
  profile (id: $id){
    id
    firstName
    lastName
    avatar
    fbId
    relation {
      id
      firstName
      avatar
    }
    totalOffered
    totalAsked
    totalComments
    relationshipType 
    totalExperiences
    totalGroups
    totalFriends
    FriendRequest {
      id
      status
    }
    createdAt
  }
}`;

export const withProfile = graphql(PROFILE_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    props: ({ profile, networkStatus, error, refetch, loading }) =>
      ({ profile, networkStatus, error, refetch, loading }),
  }),
});

const ACCOUNT_QUERY = gql`
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
  }
}`;

export const withAccount = graphql(ACCOUNT_QUERY, {
  options: {
    props: ({ account, networkStatus, error, refetch, loading }) =>
      ({ account, networkStatus, error, refetch, loading }),
  },
});
