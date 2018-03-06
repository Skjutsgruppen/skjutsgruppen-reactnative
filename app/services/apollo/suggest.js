import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SUGGEST_MUTATION_QUERY = gql`
  mutation createSuggestion(
    $tripId: Int
    $type: String
    $suggestedTripId: Int
    $suggestedGroupId: Int
    $text: String
    $isOffer: Boolean
  ){
    createSuggestion(input: {
      tripId: $tripId
      type: $type 
      suggestedTripId: $suggestedTripId
      suggestedGroupId: $suggestedGroupId
      text: $text
      isOffer: $isOffer
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
        text = null,
        isOffer = false,
      }) => mutate({
        variables: {
          tripId,
          type,
          suggestedTripId,
          suggestedGroupId,
          text,
          isOffer,
        },
      }),
    }),
});
