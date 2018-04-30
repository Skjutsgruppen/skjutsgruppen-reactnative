import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import ProfileDetail from '@components/profile/profile';
import { withProfile, withAccount } from '@services/apollo/profile';

const ProfileComponent = withProfile(ProfileDetail);
const Account = withAccount(ProfileDetail);

const Profile = ({ navigation, user }) => {
  let userId = user.id;
  let isUserProfile = false;

  if ((navigation.state.params &&
    navigation.state.params.profileId &&
    user.id !== navigation.state.params.profileId)) {
    const { profileId } = navigation.state.params;
    userId = profileId;
    isUserProfile = true;
  }

  return (
    <Wrapper>
      {isUserProfile ? <ProfileComponent id={userId} /> : <Account id={userId} />}
    </Wrapper>
  );
};

Profile.navigationOptions = {
  header: null,
};

Profile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Profile);
