import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const LOGIN_QUERY = gql`
mutation login($username: String!, $password:String!) {
  login(input : {username: $username, password: $password}) {
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
      totalFriends
    }
  }
}
`;

export const userLogin = graphql(LOGIN_QUERY, {
  props: ({ mutate }) => ({
    submit: (username, password) => mutate({ variables: { username, password } }),
  }),
});

const REGISTER_QUERY = gql`
mutation register($email: String!, $verified:Boolean) {
  register(email: $email, verified:$verified) {
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
      totalFriends
    }  
  }
}
`;

export const userRegister = graphql(REGISTER_QUERY, {
  props: ({ mutate }) => ({
    register: ({ email, verified = false }) => mutate({ variables: { email, verified } }),
  }),
});

const VERIFICATION_CODE_QUERY = gql`
mutation verifyCode($code:String!) {
  verifyCode(code:$code) {
      status
      message
  }
}
`;

export const withVerifyCode = graphql(VERIFICATION_CODE_QUERY, {
  props: ({ mutate }) => ({
    verifyCode: code => mutate({ variables: { code } }),
  }),
});

const UPDATE_USER_QUERY = gql`
mutation updateUser($firstName:String, $lastName:String, $avatar:String, $phoneNumber:String,  $phoneCountryCode: String, $password:String, $fbId:String, $fbToken: String) {
  updateUser(input:{
    firstName:$firstName, lastName: $lastName,  avatar: $avatar, phoneNumber:$phoneNumber, phoneCountryCode: $phoneCountryCode, password: $password, fbId:$fbId, fbToken: $fbToken
  }) {
    token,
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
      totalFriends
    }
  }
}
`;

export const withUpdateProfile = graphql(UPDATE_USER_QUERY, {
  props: ({ mutate }) => ({
    updateProfile: ({
      firstName,
      lastName,
      avatar,
      phoneNumber,
      phoneCountryCode,
      password,
      fbId,
      fbToken,
    }) =>
      mutate({
        variables: {
          firstName,
          lastName,
          avatar,
          phoneNumber,
          phoneCountryCode,
          password,
          fbId,
          fbToken,
        },
      }),
  }),
});


const CHECK_PHONE_VERIFICATION_QUERY = gql`
mutation {
  isPhoneVerified {
    token
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
    }
  }
} 
`;

export const withPhoneVerified = graphql(CHECK_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    isPhoneVerified: id => mutate({ variables: { id } }),
  }),
});

const CHANGE_PASSWORD_QUERY = gql`
mutation changePassword($oldPassword: String, $newPassword: String){
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    token,
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
      totalFriends
    }
  }
}
`;

export const withChangePassword = graphql(CHANGE_PASSWORD_QUERY, {
  props: ({ mutate }) => ({
    changePassword: (oldPassword, newPassword) => mutate({
      variables: { oldPassword, newPassword },
    }),
  }),
});
