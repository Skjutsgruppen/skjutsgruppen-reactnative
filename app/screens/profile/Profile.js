import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper, FloatingNavbar } from '@components/common';
import Colors from '@theme/colors';
import ProfileDetail from '@components/profile/profile';
import { withProfile, withAccount } from '@services/apollo/profile';

const ProfileComponent = withProfile(ProfileDetail);
const Account = withAccount(ProfileDetail);

const Profile = ({ navigation, user }) => {
  let userId = user.id;
  let isUserProfile = false;

  if (navigation.state.params && navigation.state.params.profileId) {
    const { profileId } = navigation.state.params;
    userId = profileId;
    isUserProfile = true;
  }

  return (
    <Wrapper bgColor={Colors.background.cream}>
      <FloatingNavbar
        handleBack={() => navigation.goBack()}
        showChange={!isUserProfile}
        handleChangePress={() => navigation.navigate('EditProfile')}
      />
      <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
        <ScrollView>
          {isUserProfile ? <ProfileComponent id={userId} /> : <Account id={userId} />}
        </ScrollView>
      </View>
    </Wrapper>
  );
};

Profile.navigationOptions = {
  header: null,
};

Profile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Profile);
