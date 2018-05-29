import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const CONNECT_QUERY = gql`
mutation connect($email: String!, $id: String!, $token: String!, $type: String!, $secret: String) {
  connect(input:{email:$email, id:$id, token:$token, type:$type, secret: $secret}) {
    token,
    status,
    error,
    message
    User {
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
    }
  }
}
`;

export const withSocialConnect = graphql(CONNECT_QUERY, {
  props: ({ mutate }) => ({
    socialConnect: ({
      email,
      id,
      token,
      type,
      secret,
    }) => mutate({ variables: { email, id, token, type, secret } }),
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
    }
  }
}
`;

export const withGetUserByEmail = graphql(GET_USER_BY_EMAIL_QUERY, {
  props: ({ mutate }) => ({
    getUserByEmail: email => mutate({ variables: { email } }),
  }),
});

const GET_USER_BY_TWITTER_ID_QUERY = gql`
mutation getUserByTwitterId($id: String!){
  getUserByTwitterId(twitterId: $id){
    token
    status,
    error,
    message,
    User{
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
    }
  }
}
`;

export const withGetUserByTwitterId = graphql(GET_USER_BY_TWITTER_ID_QUERY, {
  props: ({ mutate }) => ({
    getUserByTwitterId: id => mutate({ variables: { id } }),
  }),
});

const GET_USER_BY_FBID_QUERY = gql`
mutation getUserByFbId($id: String!) {
  getUserByFbId(fbId: $id) {
    token,
    status,
    error,
    message
    User {
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
    }
  }
}
`;

export const withgetUserByFbId = graphql(GET_USER_BY_FBID_QUERY, {
  props: ({ mutate }) => ({
    getUserByFbId: id => mutate({ variables: { id } }),
  }),
});
