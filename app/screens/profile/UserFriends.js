import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import FriendsList from '@components/profile/friendsList';
import { withMyFriends } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingBottom: 12,
  },
});

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
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Friends id={id} onPress={this.onPress} />
        </View>
      </Wrapper>
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
