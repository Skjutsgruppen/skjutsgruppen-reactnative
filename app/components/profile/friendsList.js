import React from 'react';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';

const UserFriendsList = ({ onPress, friends }) => (
  <DataList
    data={friends}
    renderItem={({ item }) => (
      <Friends
        key={item.id}
        friend={item}
        onPress={onPress}
      />
    )}
    fetchMoreOptions={{
      variables: { offset: friends.rows.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.friends.rows.length === 0) {
          return previousResult;
        }

        const rows = previousResult.friends.rows.concat(fetchMoreResult.friends.rows);

        return { friends: { ...previousResult.friends, ...{ rows } } };
      },
    }}
  />
);

UserFriendsList.propTypes = {
  friends: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default UserFriendsList;
