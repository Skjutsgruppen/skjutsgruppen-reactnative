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
    props: ({ profile }) => ({ profile }),
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
      name
      photo
      mapPhoto
      description
      User {
        id
        email
        avatar 
        firstName 
        lastName 
        relation {
          id 
          firstName 
          lastName 
          email 
          phoneNumber 
          avatar
        } 
      } 
      country 
      county 
      municipality 
      locality 
      stopsIds 
      TripStart {
        name 
        countryCode 
        coordinates 
      } 
      TripEnd {
        name 
        countryCode 
        coordinates
      } 
      Stops {
        name 
        countryCode 
        coordinates
      } 
      GroupType:type 
      outreach 
      GroupMembers {
        id
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
      Comments {
        id 
        tripId 
        groupId 
        text 
        date 
        User { 
          id 
          email 
          avatar 
          firstName 
          lastName 
          relation {
            id 
            firstName 
            lastName 
            email 
            phoneNumber 
            avatar
          }
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
      description 
      type 
      TripStart {
        name 
        coordinates 
        countryCode
      } 
      TripEnd {
        name 
        coordinates 
        countryCode
      } 
      photo 
      Stops {
        name 
        coordinates 
        countryCode
      } 
      returnTrip 
      date 
      time 
      seats 
      flexibility 
      User {
        id 
        phoneNumber 
        email 
        avatar 
        firstName 
        lastName 
        relation {
          id 
          email 
          avatar 
          firstName 
          lastName
        } 
        fbId
      } 
      Comments {
        id 
        tripId 
        groupId 
        text 
        date 
        User {
          id
          firstName
          lastName 
          email 
          avatar
        }
      } 
      url
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
