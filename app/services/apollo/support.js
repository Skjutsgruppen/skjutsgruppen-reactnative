import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SUPPORT_QUERY = gql`
  query generateClientToken {
    generateClientToken
  }
`;

const SUPPORT_MUTATION_QUERY = gql`
  mutation support(
    $planId: Int!
    $paymentMethodNonce: String!
  ){
    support(planId: $planId, paymentMethodNonce: $paymentMethodNonce)
  }
`;

export const withGenerateClientToken = graphql(SUPPORT_QUERY, {
  props: ({ data: { generateClientToken } }) => ({
    generateClientToken,
  }),
});

export const withSupport = graphql(SUPPORT_MUTATION_QUERY, {
  props: ({ mutate }) => (
    {
      support: ({
        planId = null,
        paymentMethodNonce = null,
      }) => mutate({
        variables: {
          planId,
          paymentMethodNonce,
        },
      }),
    }),
});
