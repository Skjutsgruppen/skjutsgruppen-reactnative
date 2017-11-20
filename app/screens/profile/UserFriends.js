import React, { Component } from 'react';
import FriendsList from '@components/profile/friendsList';
import { withMyFriends } from '@services/apollo/profile';
import PropTypes from 'prop-types';

const Friends = withMyFriends(FriendsList);

class UserFriends extends Component {
  onPress = (userId) => {
    const { navigation } = this.props;

    navigation.navigate('UserProfile', { profileId: userId });
  }

  render() {
    const { id } = this.props.navigation.state.params;

    return (
      <Friends id={id} onPress={this.onPress} />
    );
  }
}

UserFriends.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserFriends;
