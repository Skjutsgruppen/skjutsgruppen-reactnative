import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

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
      avatar
      fbId
      verificationCode
      phoneVerificationCode
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
      emailVerified
      email
      phoneVerified
      phoneNumber
      avatar
      fbId
      verificationCode
      phoneVerificationCode
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
      emailVerified
      email
      phoneVerified
      phoneNumber
      avatar
      fbId
      verificationCode
      phoneVerificationCode
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

const FRIEND_QUERY = gql`
query friends($id:Int, $limit: Int, $offset: Int,){ 
    friends(input:{id:$id, limit: $limit, offset: $offset}) { 
      rows {
        id 
        email 
        firstName
        lastName
        phoneNumber
        avatar
      }
      count
     } 
  }
`;

export const withFriends = graphql(FRIEND_QUERY, {
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
  }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, friends } }) => {
    let rows = [];
    let count = 0;

    if (friends) {
      rows = friends.rows;
      count = friends.count;
    }

    return { friends: { loading, rows, count } };
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
        avatar
      }
      count
     } 
  }
`;

export const withBestFriends = graphql(BEST_FRIEND_QUERY, {
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
  }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, bestFriends } }) => {
    let rows = [];
    let count = 0;

    if (bestFriends) {
      rows = bestFriends.rows;
      count = bestFriends.count;
    }
    return { bestFriends: { loading, rows, count } };
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
          mapPhoto
          User {
            id
            email
            firstName
            lastName
            avatar
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
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
  }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, groups } }) => {
    let rows = [];
    let count = 0;

    if (groups) {
      rows = groups.rows;
      count = groups.count;
    }
    return { groups: { loading, rows, count } };
  },
});


const TRIPS_QUERY = gql`

query trips($id:Int, $type:String){ 
  trips(input:{userId:$id, type:$type}) { 
        rows{
          id
          type
          description
          seats
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              firstName
              avatar
            }
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
          mapPhoto
          returnTrip
        }
        count
      }
    }
`;

export const withTrips = graphql(TRIPS_QUERY, {
  options: ({ id = null, offset = 0, limit = PER_FETCH_LIMIT, type = null, active = null }) => ({
    variables: { id, offset, limit, type, active },
  }),
  props: ({ data: { loading, trips } }) => {
    let rows = [];
    let count = 0;

    if (trips) {
      rows = trips.rows;
      count = trips.count;
    }
    return { trips: { loading, rows, count } };
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

const SHARE_QUERY = gql`
mutation share($id: Int!, $type: InputShareTypeEnum!, $share: ShareInput!) {
  share(id :$id, type :$type, share :$share)
}
`;

export const withShare = graphql(SHARE_QUERY, {
  props: ({ mutate }) => ({
    share: ({ id, type, share }) => mutate({ variables: { id, type, share } }),
  }),
});


const ADD_FRIEND_QUERY = gql`
mutation addFriend($id: Int!) {
  addFriend(id :$id)
}
`;

export const withAddFriend = graphql(ADD_FRIEND_QUERY, {
  props: ({ mutate }) => ({
    addFriend: id => mutate({ variables: { id } }),
  }),
});


const ACCEPT_FRIEND_REQUEST_QUERY = gql`
mutation acceptFriendRequest($id: Int!) {
  acceptFriendRequest(id :$id)
}
`;

export const withAcceptFriendRequest = graphql(ACCEPT_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    acceptFriendRequest: id => mutate({ variables: { id } }),
  }),
});

const REJECT_FRIEND_REQUEST_QUERY = gql`
mutation rejectFriendRequest($id: Int!) {
  rejectFriendRequest(id :$id)
}
`;

export const withRejectFriendRequest = graphql(REJECT_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    rejectFriendRequest: id => mutate({ variables: { id } }),
  }),
});

const CANCEL_FRIEND_REQUEST_QUERY = gql`
mutation cancelFriendRequest($id: Int!) {
  cancelFriendRequest(id :$id)
}
`;

export const withCancelFriendRequest = graphql(CANCEL_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    cancelFriendRequest: id => mutate({ variables: { id } }),
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
      emailVerified
      email
      phoneVerified
      phoneNumber
      avatar
      fbId
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
