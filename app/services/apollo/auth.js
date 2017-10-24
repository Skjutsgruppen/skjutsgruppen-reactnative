import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const login = gql`
mutation login($username: String!, $password:String!) {
  login(username: $username, password: $password) {
    token,
    status,
    error,
    message
    User {
      id
      firstName
      lastName
      emailVerified
      email
      phoneVerified
      phoneNumber
      photo
    }
  }
}
`;

export const userLogin = graphql(login, {
  props: ({ mutate }) => ({
    submit: (username, password) => mutate({ variables: { username, password } }),
  }),
});

const register = gql`
mutation register($email: String!) {
  register(email: $email) {
    token,
    status,
    error,
    message
    User {
      id
      firstName
      lastName
      emailVerified
      email
      verificationCode
      phoneVerified
      phoneNumber
      photo
    }  
  }
}
`;

export const userRegister = graphql(register, {
  props: ({ mutate }) => ({
    register: email => mutate({ variables: { email } }),
  }),
});


const verifyCodeQuery = gql`
mutation verifyCode($code:String!) {
  verifyCode(code:$code) {
      status
      message
  }
}
`;

export const withVerifyCode = graphql(verifyCodeQuery, {
  props: ({ mutate }) => ({
    verifyCode: code => mutate({ variables: { code } }),
  }),
});

const updateUserQuery = gql`
mutation updateUser($firstName:String, $lastName:String, $photo:String, $phoneNumber:String,  $password:String) {
  updateUser(input:{
    firstName:$firstName, lastName: $lastName,  photo: $photo, phoneNumber:$phoneNumber, password: $password
  }) {
    token,
    User {
      id
      firstName
      lastName
      emailVerified
      email
      phoneVerified
      phoneNumber
      photo
    }
  }
}
`;

export const withUpdateProfile = graphql(updateUserQuery, {
  props: ({ mutate }) => ({
    updateProfile: (firstName, lastName, photo, phoneNumber, password) => mutate({
      variables: { firstName, lastName, photo, phoneNumber, password },
    }),
  }),
});

const myFiendsQuery = gql`
query
  { 
    friends { 
      id 
      email 
      firstName
      lastName
      phoneNumber
      photo
     } 
  }
`;

export const withMyFriends = graphql(myFiendsQuery, {
  props: ({ data: { loading, friends } }) => ({
    friendLoading: loading, friends,
  }),
});

const myGroupQuery = gql`
query {
  myGroups {
      id  
      name
      photo
      }
    }
`;

export const withMyGroups = graphql(myGroupQuery, {
  props: ({ data: { loading, myGroups } }) => ({
    groupLoading: loading, groups: myGroups,
  }),
});
