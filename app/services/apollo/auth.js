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
      notification
      emailNotification
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
      notification
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
      notification
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
mutation updateUser($firstName:String,
  $lastName:String,
  $avatar:String,
  $phoneNumber:String,
  $phoneCountryCode: String,
  $password:String,
  $fbId:String,
  $fbToken: String,
  $twitterId: String,
  $twitterToken: String,
  $twitterSecret: String,
  $agreementRead: Boolean,
  $agreementAccepted: Boolean,
  $notification: Boolean,
  $emailNotification: Boolean,
) {
  updateUser(input:{
    firstName:$firstName,
    lastName: $lastName,
    avatar: $avatar,
    phoneNumber:$phoneNumber,
    phoneCountryCode: $phoneCountryCode,
    password: $password,
    fbId:$fbId,
    fbToken: $fbToken,
    twitterId: $twitterId,
    twitterToken: $twitterToken,
    twitterSecret: $twitterSecret,
    agreementRead: $agreementRead,
    agreementAccepted: $agreementAccepted
    notification: $notification,
    emailNotification: $emailNotification,
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
      notification
      emailNotification
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
      twitterId,
      twitterToken,
      twitterSecret,
      agreementRead,
      agreementAccepted,
      notification,
      emailNotification,
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
          twitterId,
          twitterToken,
          twitterSecret,
          agreementRead,
          agreementAccepted,
          notification,
          emailNotification,
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
      verificationErrorInfo {
        code
        accountInfo {
          firstName
          lastName
          email
          phoneNumber
        }
        newNumber
      }
      contactSynced
      notification
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
mutation regeneratePhoneVerification($phoneNumber: String, $email: String){
  regeneratePhoneVerification(phoneNumber: $phoneNumber, email: $email)
}
`;

export const withRegeneratePhoneVerification = graphql(REGENERATE_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    regeneratePhoneVerification: (phoneNumber, email) =>
      mutate({ variables: { phoneNumber, email } }),
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

const FORGOT_PASSWORD_MUTATION = gql`
mutation forgotPassword($email: String){
  forgotPassword(email: $email)
}
`;

export const withForgotPassword = graphql(FORGOT_PASSWORD_MUTATION, {
  props: ({ mutate }) => ({
    forgotPassword: email => mutate({
      variables: { email },
    }),
  }),
});

const CHANGE_EMAIL_QUERY = gql`
mutation changeEmail($email: String!){
  changeEmail(email: $email){
    code
    token
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
      contactSynced
      notification
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
      notification
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

export const PHONE_VERIFICATION_SUBSCRIPTION = gql`
subscription verification ($id: Int!){
  verification(userId: $id){
    accountInfo {
      firstName
      lastName
      email
      phoneNumber
    }
    newNumber
    code
  }
}
`;

const RENEW_PHONE_NUMBER = gql`
mutation renewPhoneNumber($number: String!) {
  renewPhoneNumber(number: $number) {
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
      notification
    } 
  }
}
`;

export const withRenewPhoneNumber = graphql(RENEW_PHONE_NUMBER, {
  props: ({ mutate }) => ({
    renewPhoneNumber: number => mutate({
      variables: { number },
    }),
  }),
});

const VERIFY_TOKEN_MUTATION = gql`
  mutation verifyToken($token: String) {
    verifyToken (token: $token){
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
        notification
        emailNotification
      } 
    }
  }
`;

export const withVerifyToken = graphql(VERIFY_TOKEN_MUTATION, {
  props: ({ mutate }) => ({
    verifyToken: (token = null) => mutate({
      variables: { token },
    }),
  }),
});

const GET_USER_FROM_PHONE_NUMBER = gql`
  mutation getUserByPhoneNumber ($number: String!) {
    getUserByPhoneNumber (number: $number) {
      email
    }
  }
`;

export const withGetUserFromPhoneNumber = graphql(GET_USER_FROM_PHONE_NUMBER, {
  props: ({ mutate }) => ({
    getUserByPhoneNumber: number => mutate({
      variables: { number },
    }),
  }),
});
