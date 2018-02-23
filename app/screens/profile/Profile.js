import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper, Container } from '@components/common';
import Colors from '@theme/colors';
import ProfileDetail from '@components/profile/profile';
import { withProfile, withAccount } from '@services/apollo/profile';
import ToolBar from '@components/utils/toolbar';

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
      <Container style={{ backgroundColor: Colors.background.fullWhite }} >
        {isUserProfile ? <ProfileComponent id={userId} /> : <Account id={userId} />}
      </Container>
    </Wrapper>
  );
};

Profile.navigationOptions = ({ navigation, title }) => ({
  header: (<ToolBar transparent navigation={navigation} title={title} />),
});

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
