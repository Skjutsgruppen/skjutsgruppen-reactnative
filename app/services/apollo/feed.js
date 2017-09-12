import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PAGE_SIZE = 5;

const feedQuery = gql`
query getFeed($offset: Int, $limit: Int) {
  getFeed (offset:$offset, limit:$limit){
    id
    feedable
    updatedAt
    ... on GroupFeed {
      Group {
        id
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
}
`;

export const withFeed = graphql(feedQuery, {
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: 0, limit: PAGE_SIZE },
  },
  props: ({ data }) => ({ data }),
});
