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
      emailVerified
      email
      phoneVerified
      phoneNumber
      photo
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

export const userRegister = graphql(REGISTER_QUERY, {
  props: ({ mutate }) => ({
    register: email => mutate({ variables: { email } }),
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

export const withUpdateProfile = graphql(UPDATE_USER_QUERY, {
  props: ({ mutate }) => ({
    updateProfile: (firstName, lastName, photo, phoneNumber, password) => mutate({
      variables: { firstName, lastName, photo, phoneNumber, password },
    }),
  }),
});

const MY_FRIEND_QUERY = gql`
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

export const withMyFriends = graphql(MY_FRIEND_QUERY, {
  props: ({ data: { loading, friends } }) => ({
    friendLoading: loading, friends,
  }),
});

const MY_GROUP_QUERY = gql`
query {
  myGroups {
      id  
      name
      photo
      }
    }
`;

export const withMyGroups = graphql(MY_GROUP_QUERY, {
  props: ({ data: { loading, myGroups } }) => ({
    groupLoading: loading, groups: myGroups,
  }),
});


const COUNTY_QUERY = gql`
query {
  counties {
    id
    name
    }
  }
`;

export const withCounties = graphql(COUNTY_QUERY, {
  props: ({ data: { loading, counties } }) => ({
    countyLoading: loading, counties: counties || [],
  }),
});

const MUNICIPALITY_QUERY = gql`
query municipalities($countyId:Int) {
  municipalities (countyId:$countyId) {
    id
    name
    }
  }
`;

export const withMunicipalities = graphql(MUNICIPALITY_QUERY, {
  options: ({ countyId }) => ({ variables: { countyId } }),
  props: ({ data: { loading, municipalities } }) => ({
    loading, list: municipalities || [],
  }),
});

const LOCALITY_QUERY = gql`
query localities($municipalityId:Int) {
  localities (municipalityId:$municipalityId) {
    id
    name
    }
  }
`;

export const withLocalities = graphql(LOCALITY_QUERY, {
  options: ({ municipalityId }) => ({ variables: { municipalityId } }),
  props: ({ data: { loading, localities } }) => ({
    loading, list: localities || [],
  }),
});

