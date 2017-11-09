import React, { Component } from 'react';
import GroupsList from '@components/profile/groupsList';
import { withMyGroups } from '@services/apollo/profile';
import PropTypes from 'prop-types';

const Groups = withMyGroups(GroupsList);

class UserGroups extends Component {
  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }
  }

  render() {
    const { userId } = this.props.navigation.state.params;

    return (
      <Groups userId={userId} onPress={this.onPress} />
    );
  }
}

UserGroups.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserGroups;
