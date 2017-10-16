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
      email
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
mutation register($firstName:String!, $lastName:String!, $email: String!, $password:String!,  $phoneNumber:String!) {
  register(firstName:$firstName, lastName: $lastName, email: $email,  password: $password, phoneNumber:$phoneNumber) {
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
      photo
    }  
  }
}
`;

export const userRegister = graphql(register, {
  props: ({ mutate }) => ({
    submit: (firstName, lastName, email, password, phoneNumber) => mutate({
      variables: {
        firstName, lastName, email, password, phoneNumber,
      },
    }),
  }),
});

const updateUserQuery = gql`
mutation updateUser($firstName:String!, $lastName:String!, $photo:String) {
  updateUser(firstName:$firstName, lastName: $lastName, photo: $photo) {
      id
      firstName
      lastName
      email
      phoneNumber
      photo
  }
}
`;

export const UpdateProfile = graphql(updateUserQuery, {
  props: ({ mutate }) => ({
    submit: (firstName, lastName, photo) => mutate({ variables: { firstName, lastName, photo } }),
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
