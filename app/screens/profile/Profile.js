import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper, Container } from '@components/common';
import Colors from '@theme/colors';
import ProfileDetail from '@components/profile/profile';
import { withProfile, withAccount } from '@services/apollo/profile';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';

const ProfileComponent = withProfile(ProfileDetail);
const Account = withAccount(ProfileDetail);

const styles = StyleSheet.create({
  changeButton: {
    height: 30,
    minWidth: 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.pink,
    borderRadius: 15,
    paddingHorizontal: 12,
  },
  whiteText: {
    color: Colors.text.white,
    backgroundColor: 'transparent',
  },
});

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

  const rightComponent = () => {
    if (isUserProfile) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.changeButton} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.whiteText}>{trans('profile.CHANGE')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Wrapper bgColor={Colors.background.cream}>
      <ToolBar
        transparent
        right={rightComponent}
      />

      <Container style={{ backgroundColor: Colors.background.fullWhite }} >
        {isUserProfile ? <ProfileComponent id={userId} /> : <Account id={userId} />}
      </Container>
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
