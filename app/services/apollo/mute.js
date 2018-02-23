import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const MUTE_QUERY = gql`
  mutation mute(
    $mutable: MutableEnum!
    $mutableId: Int!
    $from: String
    $to: String
    $forever: Boolean
  ) {
    mute( input: {
      mutable: $mutable
      mutableId: $mutableId
      from: $from
      to: $to
      forever: $forever
    })
  }
`;

export const withMute = graphql(MUTE_QUERY, {
  props: ({ mutate }) => ({
    mute: ({
      mutable,
      mutableId,
      from,
      to,
      forever,
    }) =>
      mutate({
        variables: {
          mutable,
          mutableId,
          from,
          to,
          forever,
        },
      }),
  }),
});

const UNMUTE_QUERY = gql`
  mutation unmute(
    $mutable: MutableEnum!
    $mutableId: Int!
  ) {
    unmute(
      mutable: $mutable
      mutableId: $mutableId
    )
  }
`;

export const withUnmute = graphql(UNMUTE_QUERY, {
  props: ({ mutate }) => ({
    unmute: ({
      mutable,
      mutableId,
    }) =>
      mutate({
        variables: {
          mutable,
          mutableId,
        },
      }),
  }),
});

const RESET_MUTE_QUERY = gql`
  mutation resetMute(
    $mutable: MutableEnum!
    $mutableId: Int!
    $from: String!
  ) {
    resetMute(
      mutable: $mutable
      mutableId: $mutableId
      from: $from
    )
  }
`;

export const withResetMute = graphql(RESET_MUTE_QUERY, {
  props: ({ mutate }) => ({
    resetMute: ({
      mutable,
      mutableId,
      from,
    }) =>
      mutate({
        variables: {
          mutable,
          mutableId,
          from,
        },
      }),
  }),
});
