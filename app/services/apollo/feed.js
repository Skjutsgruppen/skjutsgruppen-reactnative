import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
          photo
          relation {
            id,
            email,
            firstName
            photo
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
    }
    ... on TripFeed {
      Trip {
        id
        type
        description
        seats
        User {
          id
          email
          firstName
          lastName
          photo
          relation {
            id,
            email,
            firstName
            photo
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
        returnTrip
        Comments {
          id
        }
      }
    }
  }
}
`;

const GET_FEED_QUERY = gql`
query getFeed($offset: Int, $limit: Int) {
  getFeed (offset:$offset, limit:$limit){
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
          photo
          relation {
            id,
            email,
            firstName
            photo
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
          photo
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
    }
    ... on TripFeed {
      Trip {
        id
        type
        description
        seats
        User {
          id
          email
          firstName
          lastName
          photo
          relation {
            id,
            email,
            firstName
            photo
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
        Comments {
          id
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
    variables: { offset: 0, limit: 10 },
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
