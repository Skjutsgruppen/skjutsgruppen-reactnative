import React from 'react';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

const Profile = withProfile(ProfileDetail);

const UserProfile = ({ navigation }) => {
  const { profileId } = navigation.state.params;

  return (
    <ScrollView>
      <Profile
        navigation={navigation}
        id={profileId}
      />
    </ScrollView>
  );
};

UserProfile.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserProfile;
