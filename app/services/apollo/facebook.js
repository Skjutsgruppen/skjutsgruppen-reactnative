import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const GET_USER_BY_FBID_QUERY = gql`
mutation getUserByFbId($id: String!) {
  getUserByFbId(fbId: $id) {
    token,
    status,
    error,
    message
    User {
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
      createdAt
    }
  }
}
`;

export const withgetUserByFbId = graphql(GET_USER_BY_FBID_QUERY, {
  props: ({ mutate }) => ({
    getUserByFbId: id => mutate({ variables: { id } }),
  }),
});


const GET_USER_BY_EMAIL_QUERY = gql`
mutation getUserByEmail($email: String!) {
  getUserByEmail(email: $email) {
    token,
    status,
    error,
    message
    User {
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
      createdAt
    }
  }
}
`;

export const withGetUserByEmail = graphql(GET_USER_BY_EMAIL_QUERY, {
  props: ({ mutate }) => ({
    getUserByEmail: email => mutate({ variables: { email } }),
  }),
});

const CONNECT_QUERY = gql`
mutation connect($email: String!, $id: String!, $token: String!, $type: String!) {
  connect(input:{email:$email, id:$id, token:$token, type:$type}) {
    token,
    status,
    error,
    message
    User {
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
      createdAt
    }
  }
}
`;

export const withFacebookConnect = graphql(CONNECT_QUERY, {
  props: ({ mutate }) => ({
    facebookConnect: ({ email, id, token, type = 'facebook' }) => mutate({ variables: { email, id, token, type } }),
  }),
});
