import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const getGroupCommentQuery = gql`
query getGroupCommentQuery($id: Int!) {
  comments(input : {groupId:$id}) {
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

export const withGroupComment = graphql(getGroupCommentQuery, {
  options: ({ id }) => ({ variables: { id } }),
  props: ({ data: { comments, loading, error } }) => ({ comments, loading, error }),
});

const getTripCommentQuery = gql`
query getTripCommentQuery($id: Int!) {
  comments(input : {tripId:$id}) {
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

export const withTripComment = graphql(getTripCommentQuery, {
  options: ({ id }) => ({ variables: { id } }),
  props: ({ data: { comments, loading, error } }) => ({ comments, loading, error }),
});

const createCommentQuery = gql`
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

export const submitComment = graphql(createCommentQuery, {
  options: (props) => {
    const { group, offer } = props.navigation.state.params;
    console.log(props);
    if (offer) {
      return ({ refetchQueries: [{ query: getTripCommentQuery, variables: { id: offer.id } }] });
    }

    if (group) {
      return ({ refetchQueries: [{ query: getGroupCommentQuery, variables: { id: group.id } }] });
    }

    return {};
  },
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
