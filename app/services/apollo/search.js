import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

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
        outreach
        name
        description
        GroupType: type 
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
      ...on Trip {
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
    }
    count
  }
}
`;

export const withSearch = graphql(SEARCH, {
  name: 'search',
  options: ({ from, to, direction, filters, dates }) => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      from,
      to: to.length > 0 ? to : null,
      direction,
      dates,
      filters,
      dateRange: [],
      offset: 0,
      limit: PER_FETCH_LIMIT,
    },
  }),
  props: ({ search }) => ({ search }),
});
