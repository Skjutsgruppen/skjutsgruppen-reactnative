import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendList from '@components/friend/selectable';

class FriendsWithNoMembership extends Component {
  constructor(props) {
    super(props);
    this.state = { friendsList: [] };
  }

  componentWillReceiveProps({ friends }) {
    const { friendsList } = this.state;

    if (friends && !friends.loading) {
      friends.rows.forEach((friend) => {
        friendsList.push(friend);
      });
    }

    this.setState({ friendsList });
  }

  render() {
    const { setOption, selectedFriends, friends, searchQuery } = this.props;
    const { friendsList } = this.state;

    if (searchQuery.length > 0) {
      const friendsListSearch = friendsList.filter(
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
        rows={friendsList}
        setOption={id => setOption('selectedFriends', id)}
        selected={selectedFriends}
      />
    );
  }
}

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

