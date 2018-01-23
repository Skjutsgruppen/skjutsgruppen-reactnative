import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_FILTER_WANTED, FEED_FILTER_OFFERED, PER_FETCH_LIMIT } from '@config/constant';
import client from '@services/apollo';
import { profileQuery } from '@services/apollo/profile';

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
query friends($id:Int, $limit: Int, $offset: Int){ 
    friends(id:$id, limit: $limit, offset: $offset) { 
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
  props: ({ data: { loading, friends, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (friends) {
      rows = friends.rows;
      count = friends.count;
    }

    return { friends: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});

const BEST_FRIEND_QUERY = gql`
query bestFriends($id:Int, $limit: Int, $offset: Int,){ 
    bestFriends(id:$id, limit: $limit, offset: $offset) { 
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
  props: ({ data: { loading, bestFriends, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (bestFriends) {
      rows = bestFriends.rows;
      count = bestFriends.count;
    }
    return { bestFriends: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});

const GROUPS_SUBSCRIPTION_QUERY = gql`
subscription myGroup($userId: Int!){ 
  myGroup(userId: $userId) { 
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
      relation { 
        id 
        email 
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
    country 
    county 
    municipality 
    locality 
    GroupMembers { 
      id 
      avatar 
    } 
    GroupMembershipRequests {
      id 
      status 
      Member {
        id 
        email 
        firstName 
      }
    }
  }
}
`;

const GROUPS_QUERY = gql`
query groups($id:Int, $limit: Int, $offset: Int){ 
  groups(userId:$id, limit: $limit, offset: $offset) { 
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
        relation { 
          id 
          email 
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
      country 
      county 
      municipality 
      locality 
      GroupMembers { 
        id 
        avatar 
      } 
      GroupMembershipRequests {
        id 
        status 
        Member {
          id 
          email 
          firstName 
        }
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
  props: (
    {
      data: {
        loading,
        groups,
        error,
        refetch,
        networkStatus,
        fetchMore,
        subscribeToMore,
      },
    },
  ) => {
    let rows = [];
    let count = 0;

    if (groups) {
      rows = groups.rows;
      count = groups.count;
    }

    return {
      groups: { loading, rows, count, error, refetch, networkStatus, fetchMore, subscribeToMore },
      subscribeToNewGroup: param => subscribeToMore({
        document: GROUPS_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;
          const newGroup = subscriptionData.data.myGroup;

          rows = prev.groups.rows.filter((row) => {
            if (row.id === newGroup.id) {
              repeated = true;
              return null;
            }
            count += 1;

            return row;
          });

          rows = [newGroup].concat(rows);

          if (!repeated) {
            const myProfile = client.readQuery(
              {
                query: profileQuery,
                variables: { id: param.userId },
              },
            );
            myProfile.totalGroups += 1;
            client.writeQuery({ query: profileQuery, data: myProfile });
          }

          return {
            groups: { ...prev.groups, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
  },
});

const TRIPS_SUBSCRIPTION_QUERY = gql`
  subscription myTrip($userId: Int!){
    myTrip(userId:$userId){
      id 
      type 
      description 
      seats 
      parentId
      User {
        id 
        email 
        firstName 
        lastName 
        avatar 
        relation {
          id 
          email 
          firstName
          lastName
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
      totalComments
      isParticipant
      ReturnTrip {
        id
        date
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
      }
      Recurring {
        id
        date
      }
    }
  }
`;

const TRIPS_QUERY = gql`
query trips($id:Int, $type:TripTypeEnum, $active:Boolean, $limit: Int, $offset: Int ){ 
  trips(input:{userId:$id, type:$type, active:$active}, limit: $limit, offset: $offset) { 
    rows {
      id 
      type 
      description 
      seats 
      parentId
      User {
        id 
        email 
        firstName 
        lastName 
        avatar 
        relation {
          id 
          email 
          firstName
          lastName
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
      totalComments
      isParticipant
      ReturnTrip {
        id
        date
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
      }
      Recurring {
        id
        date
      }
    }
    count
  }
}
`;

export const withTrips = graphql(TRIPS_QUERY, {
  options: (
    { id = null, offset = 0, limit = PER_FETCH_LIMIT, type = FEED_FILTER_OFFERED, active = true },
  ) => ({
    variables: { id, offset, limit, type, active },
  }),
  props: (
    {
      data: {
        loading,
        trips,
        error,
        networkStatus,
        refetch,
        fetchMore,
        subscribeToMore,
      },
    },
  ) => {
    let rows = [];
    let count = 0;

    if (trips) {
      rows = trips.rows;
      count = trips.count;
    }

    return {
      trips: { loading, rows, count, error, networkStatus, subscribeToMore, refetch, fetchMore },
      subscribeToNewTrip: param => subscribeToMore({
        document: TRIPS_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;
          const newTrip = subscriptionData.data.myTrip;

          rows = prev.trips.rows.filter((row) => {
            if (row.id === newTrip.id) {
              return null;
            }
            count += 1;

            return row;
          });

          rows = [newTrip].concat(rows);

          const activeRides = client.readQuery(
            {
              query: TRIPS_QUERY,
              variables: {
                id: null,
                offset: 0,
                limit: PER_FETCH_LIMIT,
                type: FEED_FILTER_OFFERED,
                active: true,
              },
            },
          );

          activeRides.trips.rows.map((row) => {
            if (row.id === newTrip.id) {
              repeated = true;
            }

            return row;
          });

          if (!repeated) {
            const myRides = client.readQuery(
              {
                query: TRIPS_QUERY,
                variables: {
                  id: param.userId,
                  offset: 0,
                  limit: PER_FETCH_LIMIT,
                  type: FEED_FILTER_OFFERED,
                  active: null,
                },
              },
            );

            myRides.trips.rows.map((row) => {
              if (row.id === newTrip.id) {
                repeated = true;
              }

              return row;
            });
          }

          if (!repeated) {
            const myProfile = client.readQuery(
              {
                query: profileQuery,
                variables: { id: param.userId },
              },
            );

            if (newTrip.type === FEED_FILTER_WANTED) {
              myProfile.profile.totalAsked += 1;
            } else {
              myProfile.profile.totalOffered += 1;
            }

            client.writeQuery({ query: profileQuery, data: myProfile });
          }

          return {
            trips: { ...prev.trips, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
  },
});

const MY_EXPERIENCES_SUBSCRIPTION_QUERY = gql`
subscription myExperience($userId:Int!){ 
  myExperience(userId:$userId) { 
    id
    createdAt
    description
    photo
    Participants {
      User {
        id 
        email 
        firstName 
        lastName 
        avatar 
      } 
      status
    }
    Trip {
      id 
      type 
      description 
      seats 
      parentId
      User {
        id 
        email 
        firstName 
        lastName 
        avatar 
        relation {
          id 
          email 
          firstName
          lastName
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
      totalComments
      isParticipant
      duration
      ReturnTrip {
        id
        date
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
      }
      Recurring {
        id
        date
      }
    }
    User {
      id 
      firstName 
      lastName 
      email 
      avatar 
    } 
    totalComments
  }
}
`;

const MY_EXPERIENCES_QUERY = gql`
query myExperiences($id:Int, $limit: Int, $offset: Int,){ 
  myExperiences(userId:$id, limit: $limit, offset: $offset) { 
    rows{
      id
      createdAt
      description
      photo
      Participants {
        User {
          id 
          email 
          firstName 
          lastName 
          avatar 
        } 
        status
      }
      Trip {
        id 
        type 
        description 
        seats 
        parentId
        User {
          id 
          email 
          firstName 
          lastName 
          avatar 
          relation {
            id 
            email 
            firstName
            lastName
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
        totalComments
        isParticipant
        duration
        ReturnTrip {
          id
          date
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
        }
        Recurring {
          id
          date
        }
      }
      User {
        id 
        firstName 
        lastName 
        email 
        avatar 
      } 
      totalComments
    }
    count
  }
}
`;

export const withMyExperiences = graphql(MY_EXPERIENCES_QUERY, {
  options: ({ id, offset = 0, limit = PER_FETCH_LIMIT }) => ({
    variables: { id, offset, limit },
  }),
  props: (
    {
      data: {
        loading,
        myExperiences,
        error,
        networkStatus,
        refetch,
        fetchMore,
        subscribeToMore,
      },
    },
  ) => {
    let rows = [];
    let count = 0;

    if (myExperiences) {
      rows = myExperiences.rows;
      count = myExperiences.count;
    }
    return {
      myExperiences: { loading, rows, count, error, networkStatus, refetch, fetchMore },
      subscribeToNewExperience: param => subscribeToMore({
        document: MY_EXPERIENCES_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;
          const newExperience = subscriptionData.data.myExperience;

          rows = prev.myExperiences.rows.map((row) => {
            if (row.id === newExperience.id) {
              repeated = true;
              return null;
            }
            count += 1;

            return row;
          });

          if (!repeated) {
            const myProfile = client.readQuery(
              {
                query: profileQuery,
                variables: { id: param.userId },
              },
            );
            myProfile.profile.totalExperiences += 1;
            client.writeQuery({ query: profileQuery, data: myProfile });
          }

          rows = [newExperience].concat(rows);

          return {
            myExperiences: { ...prev.myExperiences, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
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
