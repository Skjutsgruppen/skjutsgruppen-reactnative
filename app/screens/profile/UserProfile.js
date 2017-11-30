import React from 'react';
import { View, ScrollView } from 'react-native';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { NavBar } from '@components/common';

const Profile = withProfile(ProfileDetail);

const UserProfile = ({ navigation }) => {
  const { profileId } = navigation.state.params;

  return (
    <View>
      <NavBar handleBack={() => navigation.goBack()} />
      <ScrollView>
        <Profile
          navigation={navigation}
          id={profileId}
        />
      </ScrollView>
    </View>
  );
};

UserProfile.navigationOptions = {
  header: null,
};

UserProfile.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserProfile;
