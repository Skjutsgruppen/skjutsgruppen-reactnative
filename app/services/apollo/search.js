import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SEARCH = gql`
query search
(
    $from: [Float]!
    $to: [Float]
    $direction: DirectionEnum
    $dates: [String]
    $dateRange: [String]
    $filters: [SearchFilterEnum]
    $limit: Int
    $offset: Int
)
{
  search(input: {
      from: $from
      to: $to
      direction: $direction
      dates: $dates
      dateRange: $dateRange
      filters: $filters
      limit: $limit
      offset: $offset
  })
  { 
    rows{
      ...on Group {
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
          relation {
            id 
            email 
            phoneNumber 
            firstName 
            lastName
          }
        } 
        country 
        county 
        municipality 
        locality 
        stopsIds 
        TripStart{ 
          name 
          coordinates
        } 
        TripEnd {
          name 
          coordinates
        } 
        Stops{
          name 
          coordinates
        } 
        GroupType: type 
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
          relation {
            id
            email
            phoneNumber
            firstName
            lastName
          }
        }
        Comments {
          id 
          tripId 
          groupId 
          text 
          date 
          User{
            id 
            email 
            photo 
            phoneNumber 
            firstName 
            lastName 
            emailVerified 
            phoneVerified 
            relation { 
              id 
              email 
              phoneNumber 
              firstName 
              lastName
            }
          }
        }
      } 
      ...on Trip {
        id 
        comment 
        type 
        TripStart { 
          name 
          coordinates 
        } 
        TripEnd {
          name 
          coordinates
        } 
        photo 
        Stops {
          name 
          coordinates
        } 
        returnTrip 
        date 
        time 
        seats 
        flexibility 
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
            email 
            phoneNumber 
            firstName 
            lastName
          } 
          totalOffered 
          totalAsked 
          totalComments
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
          }
        }
      }
    }
    count
  }
}
`;

export const withSearch = graphql(SEARCH, {
  name: 'search',
  options: ({ fromCoords, toCoords, direction, filters, dates }) => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      from: fromCoords,
      to: toCoords,
      direction,
      dates,
      filters,
      dateRange: [],
      offset: 0,
      limit: 5,
    },
  }),
  props: ({ search }) => ({ search }),
});
