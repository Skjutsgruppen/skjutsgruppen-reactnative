import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/profile';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';
import { NavBar } from '@components/common';
import { View } from 'react-native';

const Trips = withMyTrips(TripsList);

class UserTrips extends Component {
  static navigationOptions = {
    header: null,
  };

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

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { userId, type } = this.props.navigation.state.params;

    return (
      <View>
        <NavBar handleBack={this.goBack} />
        <Trips
          userId={userId}
          type={type}
          onPress={this.onPress}
          onSharePress={this.onSharePress}
        />
      </View>
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
