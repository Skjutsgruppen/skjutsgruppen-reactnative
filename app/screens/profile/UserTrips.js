import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/trip';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import { FEED_FILTER_OFFERED, FEED_FILTER_WANTED } from '@config/constant';
import { connect } from 'react-redux';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';

const Trips = withMyTrips(TripsList);

class UserTrips extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ trip: {} });
  }

  isCurrentUser = () => {
    const { navigation, user } = this.props;
    const { userId } = navigation.state.params;

    return user.id === userId;
  }

  render() {
    const { userId, username } = this.props.navigation.state.params || this.props.user.id;
    const { type } = this.props.navigation.state.params;
    let NavigationTitle = '';

    if (type === FEED_FILTER_OFFERED) {
      NavigationTitle = this.isCurrentUser() ? trans('profile.my_offered_rides') : trans('profile.users_offered_rides', { username });
    } else if (type === FEED_FILTER_WANTED) {
      NavigationTitle = this.isCurrentUser() ? trans('profile.my_asked_rides') : trans('profile.rides_user_asked_for', { username });
    }

    return (
      <Wrapper>
        <ToolBar title={NavigationTitle} />
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
