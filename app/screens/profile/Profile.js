import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import ProfileDetail from '@components/profile/profile';
import { withProfile, withAccount } from '@services/apollo/profile';

const ProfileComponent = withProfile(ProfileDetail);
const Account = withAccount(ProfileDetail);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { isUserProfile: false, userId: null };
  }

  componentWillMount() {
    const { navigation, user } = this.props;
    this.setState({ userId: user.id });

    if ((navigation.state.params &&
      navigation.state.params.profileId &&
      user.id !== navigation.state.params.profileId)) {
      const { profileId } = navigation.state.params;
      this.setState({ isUserProfile: true, userId: profileId });
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation, nav } = this.props;

    if (nav && nav.routes.length <= 1) {
      navigation.replace('Tab');
    } else {
      navigation.goBack();
    }

    return true;
  }

  render() {
    const { isUserProfile, userId } = this.state;

    return (
      <Wrapper>
        {isUserProfile ? <ProfileComponent id={userId} /> : <Account id={userId} />}
      </Wrapper>
    );
  }
}

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
  nav: PropTypes.shape({
    route: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user, nav: state.nav });

export default connect(mapStateToProps)(Profile);
