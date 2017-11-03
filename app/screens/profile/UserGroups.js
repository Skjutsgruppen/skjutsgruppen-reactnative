import React, { Component } from 'react';
import GroupsList from '@components/profile/groupsList';
import { withMyGroups } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { NavBar } from '@components/common';
import { View } from 'react-native';

const Groups = withMyGroups(GroupsList);

class UserGroups extends Component {
  static navigationOptions = {
    header: null,
  };

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { userId } = this.props.navigation.state.params;

    return (
      <View>
        <NavBar handleBack={this.goBack} />
        <Groups userId={userId} onPress={this.onPress} />
      </View>
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
