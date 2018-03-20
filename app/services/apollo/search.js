import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_TYPE_GROUP } from '@config/constant';

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
        description
        User {
          id 
          firstName 
          avatar 
        } 
        outreach
        type
        photo
        mapPhoto
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
        membershipStatus 
        totalParticipants
        isAdmin
      }
      ...on Trip {
        id 
        type 
        description 
        seats 
        User {
          id 
          firstName 
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
        date 
        photo 
        mapPhoto
        totalFeeds
      }
      ...on PublicTransport{
        Routes {
          Point {
            name
            date
            time
          }
          type
          Product {
            name
            catCode
          }
        }
        date
        url
      }
      ...on Group {
        id
        name
        description
        User {
          id 
          firstName 
          avatar 
        } 
        outreach
        type
        photo
        mapPhoto
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
        membershipStatus 
        totalParticipants
        isAdmin
      }
    }
    count
  }
}
`;

export const withSearch = graphql(SEARCH, {
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
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, search, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (search) {
      rows = search.rows;
      count = search.count;
    }

    return { search: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});

const SEARCH_ALL_TRIPS_QUERY = gql`
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
  tripSearch: search(input: {
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
      ...on Trip {
        id 
        type 
        description 
        seats 
        User {
          id 
          firstName 
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
        date 
        photo 
        mapPhoto
        totalFeeds
      }
      ...on PublicTransport{
        Routes {
          Point {
            name
            date
            time
          }
          type
          Product {
            name
            catCode
          }
        }
        date
        url
      }
    }
    count
  }
}
`;

export const withSearchAllTrips = graphql(SEARCH_ALL_TRIPS_QUERY, {
  options: ({ from, to, direction, filters, dates }) => {
    const updatedFilters = filters.filter(row => !(row === FEED_TYPE_GROUP));

    return ({
      notifyOnNetworkStatusChange: true,
      variables: {
        from,
        to: to.length > 0 ? to : null,
        direction,
        dates,
        filters: updatedFilters,
        dateRange: [],
        offset: 0,
        limit: 10,
      },
      fetchPolicy: 'network-only',
    });
  },
  props: ({ data: { loading, tripSearch, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (tripSearch) {
      rows = tripSearch.rows;
      count = tripSearch.count;
    }

    return { searchAllTrips: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});

const SEARCH_ALL_GROUPS_QUERY = gql`
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
  groupSearch: search(input: {
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
        description
        User {
          id 
          firstName 
          avatar 
        } 
        outreach
        type
        photo
        mapPhoto
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
        membershipStatus 
        totalParticipants
        isAdmin
      }
    }
    count
  }
}
`;

export const withSearchAllGroups = graphql(SEARCH_ALL_GROUPS_QUERY, {
  options: ({ from, to, direction, dates }) => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      from,
      to: to.length > 0 ? to : null,
      direction,
      dates,
      filters: [FEED_TYPE_GROUP],
      dateRange: [],
      offset: 0,
      limit: 5,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { loading, groupSearch, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (groupSearch) {
      rows = groupSearch.rows;
      count = groupSearch.count;
    }

    return { searchAllGroups: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});
