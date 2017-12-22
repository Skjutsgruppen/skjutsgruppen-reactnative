import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
    photo
    fbId
    verificationCode
    phoneVerificationCode
    relation {
      id
      email
      firstName
      lastName
      photo
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
    photo
    fbId
    verificationCode
    phoneVerificationCode
    relation {
      id
      email
      firstName
      lastName
      photo
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
        photo 
        firstName 
        lastName 
        relation {
          id 
          firstName 
          lastName 
          email 
          phoneNumber 
          photo
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
          photo 
          firstName 
          lastName 
          relation {
            id 
            firstName 
            lastName 
            email 
            phoneNumber 
            photo
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
        photo 
        phoneNumber 
        firstName 
        lastName 
        relation {
          id 
          email 
          photo 
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
    variables: { id, offset: 0, limit: 15 },
    props: ({ friends }) => ({ friends }),
  }),
});

const myTripsQuery = gql`
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
        photo 
        firstName 
        lastName 
        relation {
          id 
          email 
          photo 
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
          photo
        }
      } 
      url
    } 
    count 
  }
}
`;

export const withMyTrips = graphql(myTripsQuery, {
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
      photo
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
