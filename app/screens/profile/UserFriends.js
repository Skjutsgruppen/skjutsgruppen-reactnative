import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import FriendsList from '@components/profile/friendsList';
import { withFriends } from '@services/apollo/friend';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingBottom: 12,
  },
  lightText: {
    color: '#777777',
  },
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 27,
    marginRight: 12,
  },
});

const Friends = withFriends(FriendsList);

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
    const { id, editable } = this.props.navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Friends id={id} editable={editable} onPress={this.onPress} />
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
