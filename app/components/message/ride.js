import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@theme/colors';
import { Loading, Retry } from '@components/common';
import { withMyTrips } from '@services/apollo/trip';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Moment from 'moment';
import { PER_FETCH_LIMIT } from '@config/constant';
import ActiveRideItem from '@components/message/ActiveRideItem';
import LoadeMore from '@components/message/loadMore';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  emptyMessage: {
    opacity: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
  more: {
    height: 24,
    alignSelf: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  moreText: {
    fontSize: 12,
    color: '#333',
  },
});

class Ride extends PureComponent {
  componentWillMount() {
    const { subscribeToNewTrip, user } = this.props;
    if (user.id) {
      subscribeToNewTrip({ userId: user.id });
    }
  }

  loadMore = () => {
    const { trips } = this.props;
    if (trips.loading) return null;

    const remaining = trips.count - PER_FETCH_LIMIT;
    if (remaining < 1) return null;

    return <LoadeMore onPress={this.moreRides} remainingCount={remaining} />;
  }

  moreRides = () => {
    const { navigation } = this.props;

    navigation.navigate('ActiveRideList');
  }

  isActiveRide = trip => (Moment(trip.date).isAfter());

  render() {
    const { trips } = this.props;

    let render = (<Text style={styles.emptyMessage}>{trans('message.no_ride')}</Text>);

    let limitedTrips = trips.rows;

    if (limitedTrips.length > PER_FETCH_LIMIT) {
      limitedTrips = limitedTrips.slice(0, PER_FETCH_LIMIT);
    }

    if (trips.count > 0) {
      render = limitedTrips.filter(this.isActiveRide)
        .map(trip => <ActiveRideItem key={trip.id} trip={trip} />);
    }

    if (trips.error) {
      render = <Retry onPress={() => trips.refetch()} />;
    }

    if (trips.loading) {
      render = (
        <View style={styles.spacedWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {('Your active rides'.toUpperCase())}
        </Text>
        {render}
        {this.loadMore()}
      </View>
    );
  }
}

Ride.propTypes = {
  trips: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
    error: PropTypes.object,
    refetch: PropTypes.func,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewTrip: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyTrips, withNavigation, connect(mapStateToProps))(Ride);
