import React from 'react';
import PropTypes from 'prop-types';
import FriendList from '@components/friend/selectable';

const FriendsWithNoMembership = ({ setOption, selectedFriends, friends, searchQuery }) => {
  if (searchQuery.length > 0) {
    const friendsListSearch = friends.rows.filter(
      ({ firstName, lastName }) => (((firstName + lastName)
        .toLowerCase()))
        .includes(searchQuery.toLowerCase()),
    );

    return (
      <FriendList
        loading={friends.loading}
        rows={friendsListSearch}
        setOption={id => setOption('selectedFriends', id)}
        selected={selectedFriends}
      />
    );
  }

  return (
    <FriendList
      loading={friends.loading}
      rows={friends.rows}
      setOption={id => setOption('selectedFriends', id)}
      selected={selectedFriends}
    />
  );
};

FriendsWithNoMembership.propTypes = {
  friends: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setOption: PropTypes.func.isRequired,
  selectedFriends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default FriendsWithNoMembership;
