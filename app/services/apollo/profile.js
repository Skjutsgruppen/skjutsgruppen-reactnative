import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const profileQuery = gql`
query profile($id: Int){
  profile (id: $id){
    id
    firstName
    lastName
    emailVerified
    email
    phoneVerified
    phoneNumber
    avatar
    fbId
    verificationCode
    phoneVerificationCode
    relation {
      id
      email
      firstName
      lastName
      avatar
    }
    totalOffered
    totalAsked
    totalComments
    relationshipType 
    totalExperiences
    FriendRequest {
      id
      status
    }
  }
}`;

export const withProfile = graphql(profileQuery, {
  options: ({ id }) => ({
    variables: { id },
    props: ({ profile, networkStatus, error, refetch, loading }) =>
      ({ profile, networkStatus, error, refetch, loading }),
  }),
});

const ownerQuery = gql`
query profile {
  profile {
    id
    firstName
    lastName
    emailVerified
    email
    phoneVerified
    phoneNumber
    avatar
    fbId
    verificationCode
    phoneVerificationCode
    relation {
      id
      email
      firstName
      lastName
      avatar
    }
    totalOffered
    totalAsked
    totalComments
    relationshipType 
    totalExperiences
    FriendRequest {
      id
      status
    }
  }
}`;

export const withOwner = graphql(ownerQuery, {
  options: {
    props: ({ owner }) => ({ owner }),
  },
});

const CHECK_PHONE_VERIFICATION_QUERY = gql`
mutation isPhoneVerified($id: Int){
  isPhoneVerified(id: $id) {
    token
    User {
      id
      firstName
      lastName
      emailVerified
      email
      phoneVerified
      phoneNumber
      avatar
      fbId
      verificationCode
      phoneVerificationCode
      relation {
        id
        email
        firstName
        lastName
        avatar
      }
      totalOffered
      totalAsked
      totalComments
      relationshipType 
      totalExperiences
      FriendRequest {
        id
        status
      }
    }
  }
}
`;

export const withPhoneVerified = graphql(CHECK_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    isPhoneVerified: id => mutate({
      variables: { id },
    }),
  }),
});
