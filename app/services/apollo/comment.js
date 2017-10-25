import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const COMMENTS_SUBSCRIPTION = gql`
  subscription commentAdded($id:Int!) {
    commentAdded (channelId : $id){
      id
      text
      date
      User {
        id
        email
        firstName
        lastName
        photo
      }
    }
  }
`;

const GET_GROUP_COMMENTS = gql`
query getGroupCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {groupId:$id, offset:$offset, limit:$limit}) {
    id
    text
    date
    User {
      id
      email
      firstName
      lastName
      photo
    }
  }
}
`;

const CREATE_COMMENT = gql`
mutation createComment(
    $tripId: Int
    $groupId: Int
    $text: String!
) 
{
  createComment( 
      tripId: $tripId
      groupId: $groupId
      text: $text
  )
  {
      tripId
      groupId
      text
  }
}
`;

const GET_TRIP_COMMENTS = gql`
query getTripCommentQuery($id: Int!, $offset: Int, $limit: Int) {
  comments(input : {tripId:$id, offset:$offset, limit:$limit}) {
    id
    text
    date
    User {
      id
      email
      firstName
      lastName
      photo
    }
  }
}
`;

export const withGroupComment = graphql(GET_GROUP_COMMENTS, {
  name: 'comments',
  options: ({ id, offset, limit }) => ({ variables: { id, offset, limit } }),
  props: props => ({
    comments: props.comments,
    subscribeToNewComments: param => props.comments.subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      variables: { id: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newFeedItem = subscriptionData.data.commentAdded;

        return { comments: [newFeedItem].concat(prev.comments) };
      },
    }),
  }),
});

export const withTripComment = graphql(GET_TRIP_COMMENTS, {
  name: 'comments',
  options: ({ id, offset, limit }) => ({ variables: { id, offset, limit } }),
  props: props => ({
    comments: props.comments,
    subscribeToNewComments: param => props.comments.subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      variables: { id: param.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newFeedItem = subscriptionData.data.commentAdded;

        return { comments: [newFeedItem].concat(prev.comments) };
      },
    }),
  }),
});

export const submitComment = graphql(CREATE_COMMENT, {
  props: ({ mutate }) => (
    {
      submit: (
        tripId,
        groupId,
        text,
      ) => mutate({
        variables: {
          tripId,
          groupId,
          text,
        },
      }),
    }),
});
