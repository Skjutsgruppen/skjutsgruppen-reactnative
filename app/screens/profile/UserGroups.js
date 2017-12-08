import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import GroupsList from '@components/profile/groupsList';
import { withMyGroups } from '@services/apollo/profile';
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
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Groups userId={userId} onPress={this.onPress} />
        </View>
      </Wrapper>
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
