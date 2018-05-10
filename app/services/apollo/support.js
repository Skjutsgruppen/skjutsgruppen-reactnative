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
  options: {
    fetchPolicy: 'cache-and-network',
  },
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

const MY_SUPPORT_QUERY = gql`
  query mySupport {
    mySupport {
      subscriptions {
        id
        Plan {
          name
          description
          amountPerMonth
          billingCycle
        }
        totalRevenue
        supportedMonths
        active
      }
      total
    }
  }
`;

export const withMySupport = graphql(MY_SUPPORT_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, mySupport, refetch, networkStatus, error } }) => ({
    mySupport: { loading, data: mySupport, refetch, networkStatus, error },
  }),
});

const GARDEN_INFO_QUERY = gql`
  query gardenInfo {
    gardenInfo {
      server
      programmer
      projectManager
    }
  }
`;


const SUPPORT_RECEIVED_SUBSCRIPTION = gql`
  subscription supportReceived {
    supportReceived {
      server
      programmer
      projectManager
    }
  }
`;

export const withGardenInfo = graphql(GARDEN_INFO_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, gardenInfo, refetch, networkStatus, subscribeToMore, error } }) => ({
    gardenInfo: { loading, data: gardenInfo, refetch, networkStatus, subscribeToMore, error },
    subscribeToSupportReceived: () => subscribeToMore({
      document: SUPPORT_RECEIVED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        return {
          gardenInfo: subscriptionData.data.supportReceived,
        };
      },
    }),
  }),
});

const CANCEL_SUBSCRIPTION_MUTATION = gql`
  mutation cancelSubscription($id: Int!) {
    cancelSubscription(subscriptionId: $id)
  }
`;

export const withCancelSupportSubscription = graphql(CANCEL_SUBSCRIPTION_MUTATION, {
  props: ({ mutate }) => ({
    cancelSupportSubscription: ({ id = null }) => mutate({ variables: { id } }),
  }),
});
