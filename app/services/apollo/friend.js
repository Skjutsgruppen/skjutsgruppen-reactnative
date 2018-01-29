
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';
import { increaseProfileFriendCount, updateProfileFriendCount } from '@services/apollo/dataSync';

const ADD_FRIEND_QUERY = gql`
mutation addFriend($id: Int!) {
  addFriend(id :$id)
}
`;

export const withAddFriend = graphql(ADD_FRIEND_QUERY, {
  props: ({ mutate }) => ({
    addFriend: id => mutate({ variables: { id } }),
  }),
});


const ACCEPT_FRIEND_REQUEST_QUERY = gql`
mutation acceptFriendRequest($id: Int!) {
  acceptFriendRequest(id :$id)
}
`;

export const withAcceptFriendRequest = graphql(ACCEPT_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    acceptFriendRequest: (id, userId) => mutate({
      variables: { id },
      update: (store) => {
        updateProfileFriendCount(userId, store);
      },
    }),
  }),
});

const REJECT_FRIEND_REQUEST_QUERY = gql`
mutation rejectFriendRequest($id: Int!) {
  rejectFriendRequest(id :$id)
}
`;

export const withRejectFriendRequest = graphql(REJECT_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    rejectFriendRequest: id => mutate({ variables: { id } }),
  }),
});

const CANCEL_FRIEND_REQUEST_QUERY = gql`
mutation cancelFriendRequest($id: Int!) {
  cancelFriendRequest(id :$id)
}
`;

export const withCancelFriendRequest = graphql(CANCEL_FRIEND_REQUEST_QUERY, {
  props: ({ mutate }) => ({
    cancelFriendRequest: id => mutate({ variables: { id } }),
  }),
});

const FRIEND_SUBSCRIPTION_QUERY = gql`
  subscription myFriend($userId: Int!){
    myFriend(userId: $userId){
      id
      email
      firstName
      lastName
      phoneNumber
      avatar
    }
  }
`;

export const FRIEND_QUERY = gql`
query friends($id:Int, $limit: Int, $offset: Int){ 
    friends(id:$id, limit: $limit, offset: $offset) { 
      rows {
        id 
        firstName
        avatar
      }
      count
     } 
  }
`;

export const withFriends = graphql(FRIEND_QUERY, {
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
  }) => ({ variables: { id, offset, limit } }),
  props: ({
    data: { loading, friends, error, refetch, networkStatus, fetchMore, subscribeToMore },
  }) => {
    let rows = [];
    let count = 0;

    if (friends) {
      rows = friends.rows;
      count = friends.count;
    }

    return {
      friends: { loading, rows, count, error, refetch, networkStatus, fetchMore, subscribeToMore },
      subscribeToNewFriend: param => subscribeToMore({
        document: FRIEND_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;
          const newFriend = subscriptionData.data.myFriend;

          rows = prev.friends.rows.filter((row) => {
            if (row.id === newFriend.id) {
              repeated = true;
              return null;
            }
            count += 1;

            return row;
          });

          if (!repeated) {
            increaseProfileFriendCount();
          }

          rows = [newFriend].concat(rows);

          return {
            friends: { ...prev.friends, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
  },
});

const BEST_FRIEND_QUERY = gql`
query bestFriends($id:Int, $limit: Int, $offset: Int,){ 
    bestFriends(id:$id, limit: $limit, offset: $offset) { 
      rows {
        id 
        firstName
        avatar
      }
      count
     } 
  }
`;

export const withBestFriends = graphql(BEST_FRIEND_QUERY, {
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
  }) => ({ variables: { id, offset, limit } }),
  props: ({ data: { loading, bestFriends, error, refetch, networkStatus, fetchMore } }) => {
    let rows = [];
    let count = 0;

    if (bestFriends) {
      rows = bestFriends.rows;
      count = bestFriends.count;
    }
    return { bestFriends: { loading, rows, count, error, refetch, networkStatus, fetchMore } };
  },
});
