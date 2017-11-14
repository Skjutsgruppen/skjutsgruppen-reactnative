import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const profileQuery = gql`
query profile($id: Int){
  profile (id: $id){
    id
    email
    photo
    phoneNumber
    firstName
    lastName
    emailVerified
    phoneVerified
    verificationCode
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

export const withProfile = graphql(profileQuery, {
  options: ({ id }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { id },
    props: ({ profile }) => ({ profile }),
  }),
});

const ownerQuery = gql`
query profile {
  profile {
    id
    email
    photo
    phoneNumber
    firstName
    lastName
    emailVerified
    phoneVerified
    verificationCode
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
    notifyOnNetworkStatusChange: true,
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
      description
      User {
        id
        email
        photo 
        phoneNumber 
        firstName 
        lastName 
        emailVerified 
        phoneVerified 
        verificationCode 
        relation {
          id 
          firstName 
          lastName 
          email 
          phoneNumber 
          photo
        } 
        totalOffered 
        totalAsked 
        totalComments 
        fbId 
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
        email 
        photo 
        phoneNumber 
        firstName 
        lastName 
        emailVerified 
        phoneVerified 
        verificationCode 
        relation {
          id 
          firstName 
          lastName 
          email 
          phoneNumber 
          photo
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
          phoneNumber 
          firstName 
          lastName 
          emailVerified 
          phoneVerified 
          verificationCode 
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
    notifyOnNetworkStatusChange: true,
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
        emailVerified 
        phoneVerified 
        verificationCode 
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
    notifyOnNetworkStatusChange: true,
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
        emailVerified 
        phoneVerified 
        verificationCode 
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
    notifyOnNetworkStatusChange: true,
    variables: { userId, type },
    props: ({ trips }) => ({ trips }),
  }),
});
