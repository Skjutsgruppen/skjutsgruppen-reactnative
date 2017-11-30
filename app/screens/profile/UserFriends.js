import React, { Component } from 'react';
import { View } from 'react-native';
import FriendsList from '@components/profile/friendsList';
import { withMyFriends } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { NavBar } from '@components/common';

const Friends = withMyFriends(FriendsList);

class UserFriends extends Component {
  static navigationOptions = {
    header: null,
  };

  onPress = (userId) => {
    const { navigation } = this.props;

    navigation.navigate('UserProfile', { profileId: userId });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { id } = this.props.navigation.state.params;

    return (
      <View>
        <NavBar handleBack={this.goBack} />
        <Friends id={id} onPress={this.onPress} />
      </View>
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
