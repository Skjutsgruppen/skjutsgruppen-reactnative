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
        duration
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
    ... on NewsFeed { 
      News {
        id 
        User {
          id 
          firstName 
          lastName 
          email 
          avatar 
          relation {
            id 
            firstName 
            avatar
          }
        } 
        title 
        body 
        links 
        photo 
        visibleFrom 
        visibleUntil 
        updatedAt
        totalComments
      }
    }
    ... on ExperienceFeed{
      Experience{
        id
        createdAt
        description
        photo
        Participants {
          User {
            id 
            email 
            firstName 
            lastName 
            avatar 
          } 
          status
        }
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
          isParticipant
          duration
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
        User {
          id 
          firstName 
          lastName 
          email 
          avatar 
        } 
        totalComments
      }
    }
  }
}
`;

export const GET_FEED_QUERY = gql`
query getFeed($offset: Int, $limit: Int, $filter:FeedFilter) {
  getFeed (offset:$offset, limit:$limit, filter:$filter){
   totalExperiences
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
        isParticipant
        duration
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
    ... on NewsFeed { 
      News {
        id 
        User {
          id 
          firstName 
          lastName 
          email 
          avatar 
          relation {
            id 
            firstName 
            avatar
          }
        } 
        title 
        body 
        links 
        photo 
        visibleFrom 
        visibleUntil 
        updatedAt
        totalComments
      }
    }
    ... on ExperienceFeed{
      Experience{
        id
        createdAt
        description
        photo
        Participants {
          User {
            id 
            email 
            firstName 
            lastName 
            avatar 
          } 
          status
        }
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
          isParticipant
          duration
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
        User {
          id 
          firstName 
          lastName 
          email 
          avatar 
        } 
        totalComments
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
    let totalExperiences = 0;
    let rows = [];
    let count = 0;

    if (getFeed) {
      totalExperiences = getFeed.totalExperiences;
      rows = getFeed.rows;
      count = getFeed.count;
    }

    return {
      feeds: {
        loading,
        totalExperiences,
        rows,
        count,
        fetchMore,
        refetch,
        subscribeToMore,
        networkStatus,
        error,
      },
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
