import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING, FEEDABLE_TRIP } from '@config/constant';
import client from '@services/apollo';
import { GET_FEED_QUERY } from '@services/apollo/trip';
import { PROFILE_QUERY } from '@services/apollo/profile';

const increaseCommentCount = (repeated, userId) => {
  try {
    if (!repeated) {
      const myProfile = client.readQuery(
        {
          query: PROFILE_QUERY,
          variables: { id: userId },
        },
      );

      myProfile.profile.totalComments += 1;

      client.writeQuery(
        {
          query: PROFILE_QUERY,
          data: myProfile,
          variables: { id: userId },
        },
      );
    }
  } catch (err) {
    console.warn(err);
  }
};

const COMMENTS_SUBSCRIPTION = gql`
  subscription commentAdded($tripId:Int, $groupId:Int, $newsId: Int) {
    commentAdded (input : {tripId:$tripId, groupId:$groupId, newsId: $newsId }){
      id
      text
      date
      User {
        id
        firstName
        avatar
        relation{
          id
          firstName
          avatar
        }
      }
    }
  }
`;

const GET_TRIP_COMMENTS_QUERY = gql`
query getTripCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {tripId:$id, offset:$offset, limit:$limit}) {
    rows {
      id
      text
      date
      User {
        id
        firstName
        avatar
        relation {
          id
          firstName
          avatar
        }
      }
    }
    count
  }
}
`;

export const withTripComment = graphql(GET_TRIP_COMMENTS_QUERY, {
  options: ({ id, offset, limit = PER_FETCH_LIMIT }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { id, offset, limit },
  }),
  props: ({ data }) => {
    let rows = [];
    let count = 0;
    const { error, fetchMore, comments, loading, networkStatus, variables, subscribeToMore } = data;

    if (comments) {
      rows = comments.rows.slice(0).reverse();
      count = comments.count;
    }

    return {
      comments: { rows, count, fetchMore, loading, error, networkStatus },
      subscribeToNewComments: () => subscribeToMore({
        document: COMMENTS_SUBSCRIPTION,
        variables: { tripId: variables.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;

          const newFeedItem = subscriptionData.data.commentAdded;
          let repeated = false;

          rows = prev.comments.rows.filter((row) => {
            if (row.id === newFeedItem.id) {
              repeated = true;
              return null;
            }
            count += 1;

            return row;
          });

          rows = [newFeedItem].concat(rows);

          try {
            if (!repeated) {
              const feeds = client.readQuery({ query: GET_FEED_QUERY, variables: { offset: 0, limit: 10, filter: { type: FEED_FILTER_EVERYTHING } } });

              feeds.getFeed.rows.map((feed) => {
                if (feed.feedable === FEEDABLE_TRIP && feed.Trip.id === variables.id) {
                  feed.Trip.totalComments += 1;
                  feed.Trip.isParticipant = true;
                }

                return feed;
              });

              client.writeQuery({ query: GET_FEED_QUERY, data: feeds, variables: { offset: 0, limit: 10, filter: { type: FEED_FILTER_EVERYTHING } } });
            }
          } catch (err) {
            console.warn(err);
          }

          increaseCommentCount(repeated, newFeedItem.User.id);

          return {
            comments: { ...prev.comments, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
  },
});

const GET_NEWS_COMMENTS_QUERY = gql`
query getNewsCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {newsId:$id, offset:$offset, limit:$limit}) {
    rows {
      id
      text
      date
      User {
        id
        firstName
        avatar
        relation {
          id
          firstName
          avatar
        }
      }
    }
    count
  }
}
`;

export const withNewsComment = graphql(GET_NEWS_COMMENTS_QUERY, {
  name: 'comments',
  options: ({ id, offset, limit = PER_FETCH_LIMIT }) => ({ variables: { id, offset, limit } }),
  props: props => ({
    comments: props.comments,
    subscribeToNewComments: param => props.comments.subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      variables: { newsId: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newFeedItem = subscriptionData.data.commentAdded;
        let rows = [];
        let count = 0;
        let repeated = false;

        rows = prev.comments.rows.filter((row) => {
          if (row.id === newFeedItem.id) {
            repeated = true;
            return null;
          }
          count += 1;

          return row;
        });

        rows = [newFeedItem].concat(rows);

        try {
          if (!repeated) {
            const feeds = client.readQuery({ query: GET_FEED_QUERY, variables: { offset: 0, limit: 10, filter: { type: FEED_FILTER_EVERYTHING } } });

            feeds.getFeed.rows.map((feed) => {
              if (feed.feedable === 'News' && feed.News.id === props.ownProps.id) {
                feed.News.totalComments += 1;
              }

              return feed;
            });

            client.writeQuery({ query: GET_FEED_QUERY, data: feeds, variables: { offset: 0, limit: 10, filter: { type: FEED_FILTER_EVERYTHING } } });
          }
        } catch (err) {
          console.warn(err);
        }

        increaseCommentCount(repeated, newFeedItem.User.id);

        return {
          comments: { ...prev.comments, ...{ rows, count: count + 1 } },
        };
      },
    }),
  }),
});

const CREATE_COMMENT_QUERY = gql`
mutation createComment(
    $tripId: Int
    $groupId: Int
    $newsId: Int
    $text: String!
) 
{
  createComment( 
      tripId: $tripId
      groupId: $groupId
      newsId: $newsId
      text: $text
  )
  {
      tripId
      groupId
      newsId
      text
  }
}
`;

export const submitComment = graphql(CREATE_COMMENT_QUERY, {
  props: ({ mutate }) => (
    {
      submit: ({
        tripId = null,
        groupId = null,
        newsId = null,
        text,
      }) => mutate({
        variables: {
          tripId,
          groupId,
          newsId,
          text,
        },
      }),
    }),
});

