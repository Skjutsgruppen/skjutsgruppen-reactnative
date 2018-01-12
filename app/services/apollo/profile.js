import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

const profileQuery = gql`
query profile($id: Int){
  profile (id: $id){
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
    relation {
      id
      email
      firstName
      lastName
      avatar
    }
    totalOffered
    totalAsked
    totalComments
    relationshipType 
    FriendRequest {
      id
      status
    }
  }
}`;

export const withProfile = graphql(profileQuery, {
  options: ({ id }) => ({
    variables: { id },
    props: ({ profile, networkStatus, error, refetch, loading }) =>
      ({ profile, networkStatus, error, refetch, loading }),
  }),
});

const ownerQuery = gql`
query profile {
  profile {
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
    relation {
      id
      email
      firstName
      lastName
      avatar
    }
    totalOffered
    totalAsked
    totalComments
  }
}`;

export const withOwner = graphql(ownerQuery, {
  options: {
    props: ({ owner }) => ({ owner }),
  },
});

const myGroupsQuery = gql`
query groups ($userId: Int) {
  groups (userId: $userId) {
    rows {
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
      country
      county
      municipality
      locality
      GroupMembers{
        id
        avatar
      }
      GroupMembershipRequests{
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
}`;

export const withMyGroups = graphql(myGroupsQuery, {
  options: ({ userId }) => ({
    variables: { userId },
    props: ({ groups }) => ({ groups }),
  }),
});

const myFriendsQuery = gql`
  query friends (
    $id: Int
    $limit: Int
    $offset: Int
  )
  {
    friends(input: {
      id: $id
      limit: $limit
      offset: $offset
    })
    {
      rows {
        id 
        email 
        avatar 
        phoneNumber 
        firstName 
        lastName 
        relation {
          id 
          email 
          avatar 
          phoneNumber 
          firstName 
          lastName
        } 
        totalOffered 
        totalAsked 
        totalComments 
        fbId
      } 
      count 
    }
  }
`;

export const withMyFriends = graphql(myFriendsQuery, {
  options: ({ id }) => ({
    variables: { id, offset: 0, limit: PER_FETCH_LIMIT },
    props: ({ friends }) => ({ friends }),
  }),
});

const MY_TRIPS_QUERY = gql`
query trips (
  $userId: Int
  $type: String
)
{
  trips(
    input:{
      userId: $userId
      type: $type
    }
  )
  {
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

export const withMyTrips = graphql(MY_TRIPS_QUERY, {
  options: ({ userId, type }) => ({
    variables: { userId, type },
    props: ({ trips }) => ({ trips }),
  }),
});

const CHECK_PHONE_VERIFICATION_QUERY = gql`
mutation isPhoneVerified($id: Int){
  isPhoneVerified(id: $id) {
    token
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

export const withPhoneVerified = graphql(CHECK_PHONE_VERIFICATION_QUERY, {
  props: ({ mutate }) => ({
    isPhoneVerified: id => mutate({
      variables: { id },
    }),
  }),
});

const VERIFY_PHONE_NUMBER_QUERY = gql`
mutation verifyPhoneNumber ($number: String, $code: String) {
  verifyPhoneNumber (number: $number, code: $code) {
    status 
    User {
      id 
      email 
      avatar 
      phoneNumber 
      firstName 
      lastName 
      emailVerified 
      phoneVerified
    } 
    message
  }
}
`;

export const withVerifyPhoneNumber = graphql(VERIFY_PHONE_NUMBER_QUERY, {
  props: ({ mutate }) => ({
    verifyPhoneNumber: (number, code) => mutate({
      variables: { number, code },
    }),
  }),
});
