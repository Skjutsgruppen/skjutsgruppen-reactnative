import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const LOGIN_QUERY = gql`
mutation login($username: String!, $password:String!) {
  login(input : {username: $username, password: $password}) {
    token,
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
      totalComments
      totalExperiences
      totalGroups
      totalFriends
      fbId      
      createdAt
      isSupporter
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
      totalComments
      totalExperiences
      totalGroups
      totalFriends
      fbId      
      createdAt
      isSupporter
    }
  }
}
`;

export const userRegister = graphql(REGISTER_QUERY, {
  props: ({ mutate }) => ({
    register: ({ email, verified = false }) => mutate({ variables: { email, verified } }),
  }),
});

const VERIFICATION_EMAIL_QUERY = gql`
mutation verifyEmail($email:String!, $code:String!) {
  verifyEmail(email: $email, code:$code) {
    code
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
      totalComments
      totalExperiences
      totalGroups
      totalFriends
      fbId      
      createdAt
      isSupporter
    }
  }
}
`;

export const withVerifyEmail = graphql(VERIFICATION_EMAIL_QUERY, {
  props: ({ mutate }) => ({
    verifyEmail: (email, code) => mutate({ variables: { email, code } }),
  }),
});

const RESEND_EMAIL_VERIFICATION_QUERY = gql`
mutation resendEmailVerification($email:String){
  resendEmailVerification(email:$email)
}
`;

export const withResendEmailVerification = graphql(RESEND_EMAIL_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    resendEmailVerification: email => mutate({ variables: { email } }),
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
  }
} 
`;

export const withPhoneVerified = graphql(CHECK_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    isPhoneVerified: id => mutate({ variables: { id } }),
  }),
});

const REGENERATE_PHONE_VERIFICATION_QUERY = gql`
mutation regeneratePhoneVerification($phoneNumber: String){
  regeneratePhoneVerification(phoneNumber: $phoneNumber)
}
`;

export const withRegeneratePhoneVerification = graphql(REGENERATE_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    regeneratePhoneVerification: phoneNumber => mutate({ variables: { phoneNumber } }),
  }),
});

const CHANGE_PASSWORD_QUERY = gql`
mutation changePassword($oldPassword: String, $newPassword: String){
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
`;

export const withChangePassword = graphql(CHANGE_PASSWORD_QUERY, {
  props: ({ mutate }) => ({
    changePassword: (oldPassword, newPassword) => mutate({
      variables: { oldPassword, newPassword },
    }),
  }),
});

const CHANGE_EMAIL_QUERY = gql`
mutation changeEmail($email: String!){
  changeEmail(email: $email){
    code
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
      totalComments
      totalExperiences
      totalGroups
      totalFriends
      fbId      
      createdAt
      isSupporter
    }
  }
}
`;

export const withChangeEmail = graphql(CHANGE_EMAIL_QUERY, {
  props: ({ mutate }) => ({
    changeEmail: email => mutate({
      variables: { email },
    }),
  }),
});

const CHANGE_PHONE_NUMBER = gql`
mutation changePhoneNumber($phoneCountryCode: String!, $phoneNumber: String!) {
  changePhoneNumber(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber){
    code
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
      totalComments
      totalExperiences
      totalGroups
      totalFriends
      fbId      
      createdAt
      isSupporter
    }
  }
}`;

export const withChangePhoneNumber = graphql(CHANGE_PHONE_NUMBER, {
  props: ({ mutate }) => ({
    changePhoneNumber: (phoneCountryCode, phoneNumber) => mutate({
      variables: { phoneCountryCode, phoneNumber },
    }),
  }),
});
