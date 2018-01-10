import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING } from '@config/constant';

const FEED_SUBSCRIPTION = gql`
subscription{
  feed {
    id
    feedable
    updatedAt
    ... on GroupFeed {
      Group {
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
    ... on TripFeed {
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
  }
}
`;

export const GET_FEED_QUERY = gql`
query getFeed($offset: Int, $limit: Int, $filter:FeedFilter) {
  getFeed (offset:$offset, limit:$limit, filter:$filter){
   rows {
    id
    feedable
    updatedAt
    ... on GroupFeed {
      Group {
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
    ... on TripFeed { 
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
   }
   count
  }
}
`;

export const withFeed = graphql(GET_FEED_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
  },
  props: ({
    data: { loading, getFeed, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (getFeed) {
      rows = getFeed.rows;
      count = getFeed.count;
    }

    return {
      feeds: { loading, rows, count, fetchMore, refetch, subscribeToMore, networkStatus, error },
      subscribeToFeed: () => subscribeToMore({
        document: FEED_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newrows = [subscriptionData.data.feed].concat(prev.getFeed.rows);

          return {
            getFeed: {
              ...prev.getFeed,
              ...{ rows: newrows, count: prev.getFeed.count + 1 },
            },
          };
        },
      }),
    };
  },
});
