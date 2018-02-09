import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';
import { increaseProfileComment, increaseFeedCommentCount } from '@services/apollo/dataSync';

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
    variables: { id, offset, limit },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => {
    let rows = [];
    let count = 0;
    const { error, fetchMore, comments, loading, networkStatus, subscribeToMore } = data;

    if (comments) {
      rows = comments.rows.slice(0).reverse();
      count = comments.count;
    }

    return {
      comments: { rows, count, fetchMore, loading, error, networkStatus },
      subscribeToNewComments: ({ id, userId }) => subscribeToMore({
        document: COMMENTS_SUBSCRIPTION,
        variables: { tripId: id },
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
              return false;
            }
            count += 1;

            return true;
          });

          rows = [newFeedItem].concat(rows);

          if (!repeated) {
            increaseProfileComment();
            increaseFeedCommentCount(id, (newFeedItem.User.id === userId));
          }

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
    subscribeToNewComments: ({ id, userId }) => props.comments.subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      variables: { newsId: id },
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
            return false;
          }
          count += 1;

          return true;
        });

        rows = [newFeedItem].concat(rows);

        if (!repeated) {
          increaseProfileComment();
          increaseFeedCommentCount(id, (newFeedItem.User.id === userId));
        }

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

