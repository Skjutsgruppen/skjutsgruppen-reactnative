import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PAGE_OFFSET = 0;
const PAGE_LIMIT = 5;

const feedQuery = gql`
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
      }
    }
    ... on TripFeed {
      Trip {
        id
        type
        comment
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
      }
    }
   }
   count
  } 
}
`;

export const withFeed = graphql(feedQuery, {
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: PAGE_OFFSET, limit: PAGE_LIMIT },
  },

  props: ({ data: { loading, getFeed, fetchMore, refetch, networkStatus, error } }) => {
    let rows = [];
    let count = 0;

    if (getFeed) {
      rows = getFeed.rows;
      count = getFeed.count;
    }

    return { feeds: { loading, rows, total: count, fetchMore, refetch, networkStatus, error } };
  },
});
