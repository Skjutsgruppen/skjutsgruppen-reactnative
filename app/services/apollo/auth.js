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

const FRIEND_QUERY = gql`
query friends($id:Int, $limit: Int, $offset: Int,){ 
    friends(input:{id:$id, limit: $limit, offset: $offset}) { 
      rows {
        id 
        email 
        firstName
        lastName
        phoneNumber
        photo
      }
      count
     } 
  }
`;

export const withFriends = graphql(FRIEND_QUERY, {
  options: ({ id = null, offset = 0, limit = 5 }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, friends } }) => {
    let rows = [];
    let count = 0;

    if (friends) {
      rows = friends.rows;
      count = friends.count;
    }

    return { friends: { loading, rows, total: count } };
  },
});

const BEST_FRIEND_QUERY = gql`
query bestFriends($id:Int, $limit: Int, $offset: Int,){ 
    bestFriends(input:{id:$id, limit: $limit, offset: $offset}) { 
      rows {
        id 
        email 
        firstName
        lastName
        phoneNumber
        photo
      }
      count
     } 
  }
`;

export const withBestFriends = graphql(BEST_FRIEND_QUERY, {
  options: ({ id = null, offset = 0, limit = 5 }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, bestFriends } }) => {
    let rows = [];
    let count = 0;

    if (bestFriends) {
      rows = bestFriends.rows;
      count = bestFriends.count;
    }
    return { bestFriends: { loading, rows, total: count } };
  },
});


const GROUPS_QUERY = gql`
query groups($id:Int){ 
  groups(userId:$id) { 
        rows{
          id
          outreach
          name
          description
          type
          photo
          User {
            id
            email
            firstName
            lastName
            photo
          }
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          country
          county
          municipality
          locality
          GroupMembers{
            id
          }
        }
        count
      }
    }
`;

export const withGroups = graphql(GROUPS_QUERY, {
  options: ({ id = null, offset = 0, limit = 5 }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, groups } }) => {
    let rows = [];
    let count = 0;

    if (groups) {
      rows = groups.rows;
      count = groups.count;
    }
    return { groups: { loading, rows, total: count } };
  },
});


const TRIPS_QUERY = gql`

query trips($id:Int, $type:String){ 
  trips(input:{userId:$id, type:$type}) { 
        rows{
          id
          type
          comment
          seats
          User {
            id
            email
            firstName
            lastName
            photo
          }
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          date
          time
          photo
          returnTrip
        }
        count
      }
    }
`;

export const withTrips = graphql(TRIPS_QUERY, {
  options: ({ id = null, offset = 0, limit = 5, type = null, active = null }) => ({
    variables: { id, offset, limit, type, active },
  }),
  props: ({ data: { loading, trips } }) => {
    let rows = [];
    let count = 0;

    if (trips) {
      rows = trips.rows;
      count = trips.count;
    }
    return { trips: { loading, rows, total: count } };
  },
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
