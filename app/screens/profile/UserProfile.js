import React from 'react';
import { ScrollView, View } from 'react-native';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';

const Profile = withProfile(ProfileDetail);

const UserProfile = ({ navigation }) => {
  const { profileId } = navigation.state.params;

  return (
    <Wrapper bgColor={Colors.background.cream}>
      <NavBar handleBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
        <ScrollView>
          <Profile
            id={profileId}
          />
        </ScrollView>
      </View>
    </Wrapper>
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
