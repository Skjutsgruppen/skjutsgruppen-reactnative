import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PAGE_OFFSET = 0;
const PAGE_LIMIT = 5;

const feedQuery = gql`
query getFeed($offset: Int, $limit: Int) {
  getFeed (offset:$offset, limit:$limit){
   Feed {
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
   total
  } 
}
`;

export const withFeed = graphql(feedQuery, {
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: PAGE_OFFSET, limit: PAGE_LIMIT },
  },
  props: ({ data }) => {
    let Feed = [];
    let total = 0;

    if (data.getFeed) {
      Feed = data.getFeed.Feed;
      total = data.getFeed.total;
    }

    return { data: { ...data, ...{ getFeed: Feed, total } } };
  },
});

