import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';
import client from '@services/apollo';
import { GET_FEED_QUERY } from '@services/apollo/feed';

const COMMENTS_SUBSCRIPTION = gql`
  subscription commentAdded($tripId:Int, $groupId:Int, $newsId: Int) {
    commentAdded (input : {tripId:$tripId, groupId:$groupId, newsId: $newsId }){
      id
      text
      date
      User {
        id
        email
        firstName
        lastName
        avatar
        relation{
          id
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

const GET_GROUP_COMMENTS = gql`
query getGroupCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {groupId:$id, offset:$offset, limit:$limit}) {
    rows {
      id
      text
      date
      User {
        id
        email
        firstName
        lastName
        avatar
        relation{
          id
          firstName
          lastName
          avatar
        }
      }
    }
    count
  }
}
`;

export const withGroupComment = graphql(GET_GROUP_COMMENTS, {
  name: 'comments',
  options: ({ id, offset, limit = PER_FETCH_LIMIT }) => ({ variables: { id, offset, limit } }),
  props: props => ({
    comments: props.comments,
    subscribeToNewComments: param => props.comments.subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      variables: { groupId: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newFeedItem = subscriptionData.data.commentAdded;

        const rows = [newFeedItem].concat(prev.comments.rows);

        return {
          comments: { ...prev.comments, ...{ rows, count: prev.comments.count + 1 } },
        };
      },
    }),
  }),
});

const GET_TRIP_COMMENTS_QUERY = gql`
query getTripCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {tripId:$id, offset:$offset, limit:$limit}) {
    rows {
      id
      text
      date
      User {
        id
        email
        firstName
        lastName
        avatar
        relation {
          id
          firstName
          lastName
          avatar
        }
      }
    }
    count
  }
}
`;

export const withTripComment = graphql(GET_TRIP_COMMENTS_QUERY, {
  name: 'comments',
  options: ({ id, offset, limit = PER_FETCH_LIMIT }) => ({ variables: { id, offset, limit } }),
  props: ({ comments }) => {
    let rows = [];
    let count = 0;
    const { error, fetchMore, loading, networkStatus, variables, subscribeToMore } = comments;

    if (comments.comments) {
      rows = comments.comments.rows.slice(0).reverse();
      count = comments.comments.count;
    }

    return {
      comments: { comments: { rows, count }, fetchMore, loading, error, networkStatus },
      subscribeToNewComments: () => subscribeToMore({
        document: COMMENTS_SUBSCRIPTION,
        variables: { tripId: variables.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newFeedItem = subscriptionData.data.commentAdded;
          const feeds = client.readQuery({ query: GET_FEED_QUERY, variables: { offset: 0, limit: 10, filter: { type: 'everything' } } });

          feeds.getFeed.rows.map((feed) => {
            if (feed.feedable === 'Trip' && feed.Trip.id === variables.id) {
              feed.Trip.totalComments += 1;
              feed.Trip.isParticipant = true;
            }

            return feed;
          });

          client.writeQuery({ query: GET_FEED_QUERY, data: feeds, variables: { offset: 0, limit: 10, filter: { type: 'everything' } } });

          rows = [newFeedItem].concat(prev.comments.rows);

          return {
            comments: { ...prev.comments, ...{ rows, count: prev.comments.count + 1 } },
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
        email
        firstName
        lastName
        avatar
        relation {
          id
          firstName
          lastName
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
        const feeds = client.readQuery({ query: GET_FEED_QUERY, variables: { offset: 0, limit: 10, filter: { type: 'everything' } } });

        feeds.getFeed.rows.map((feed) => {
          if (feed.feedable === 'News' && feed.News.id === props.ownProps.id) {
            feed.News.totalComments += 1;
          }

          return feed;
        });

        client.writeQuery({ query: GET_FEED_QUERY, data: feeds, variables: { offset: 0, limit: 10, filter: { type: 'everything' } } });

        const rows = [newFeedItem].concat(prev.comments.rows);

        return {
          comments: { ...prev.comments, ...{ rows, count: prev.comments.count + 1 } },
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
