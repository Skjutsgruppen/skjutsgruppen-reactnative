import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SUGGEST_MUTATION_QUERY = gql`
  mutation createSuggestion(
    $tripId: Int
    $type: String
    $suggestedTripId: Int
    $suggestedGroupId: Int
  ){
    createSuggestion(input: {
      tripId: $tripId
      type: $type 
      suggestedTripId: $suggestedTripId
      suggestedGroupId: $suggestedGroupId
    })
  }
`;

export const submitSuggestion = graphql(SUGGEST_MUTATION_QUERY, {
  props: ({ mutate }) => (
    {
      createSuggestion: ({
        tripId = null,
        type = null,
        suggestedTripId = null,
        suggestedGroupId = null,
      }) => mutate({
        variables: {
          tripId,
          type,
          suggestedTripId,
          suggestedGroupId,
        },
      }),
    }),
});
