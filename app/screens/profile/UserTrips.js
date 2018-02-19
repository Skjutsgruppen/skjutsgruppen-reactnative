import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/trip';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';
import { Wrapper, FloatingNavbar } from '@components/common';
import Colors from '@theme/colors';
import { FEED_FILTER_OFFERED, FEED_FILTER_WANTED } from '@config/constant';
import { connect } from 'react-redux';

const Trips = withMyTrips(TripsList);

class UserTrips extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ trip: {} });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { userId, username } = this.props.navigation.state.params || this.props.user.id;
    const { type } = this.props.navigation.state.params;
    let NavigationTitle = '';

    if (type === FEED_FILTER_OFFERED) {
      NavigationTitle = `${username}'s Offered Rides`;
    } else if (type === FEED_FILTER_WANTED) {
      NavigationTitle = `Rides ${username} asked for`;
    }

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <FloatingNavbar
          handleBack={this.goBack}
          transparent={false}
          title={NavigationTitle}
        />
        <Trips
          id={userId}
          type={type}
          active={null}
        />
      </Wrapper>
    );
  }
}

UserTrips.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.numeric,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(UserTrips);
