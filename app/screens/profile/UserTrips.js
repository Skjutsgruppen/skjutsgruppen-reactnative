import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/profile';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';

const Trips = withMyTrips(TripsList);

class UserTrips extends Component {
  constructor(props) {
    super(props);
    this.state = ({ isGroup: true, isOpen: false });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }

    if (type === 'ask') {
      navigation.navigate('AskDetail', { ask: detail });
    }

    if (type === 'offer') {
      navigation.navigate('OfferDetail', { offer: detail });
    }
  }

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== 'group' });
  };

  render() {
    const { userId, type } = this.props.navigation.state.params;

    return (
      <Trips userId={userId} type={type} onPress={this.onPress} onSharePress={this.onSharePress} />
    );
  }
}

UserTrips.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserTrips;
