import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@components/utils/texts';
import Colors from '@theme/colors';
import { withMyTrips } from '@services/apollo/trip';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Moment from 'moment';
import ActiveRideItem from '@components/message/ActiveRideItem';
import LoadMore from '@components/message/loadMore';
import DataList from '@components/dataList';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
    paddingVertical: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginHorizontal: 24,
  },
});

class Ride extends Component {
  componentWillMount() {
    const { subscribeToNewTrip, user } = this.props;

    if (user.id) {
      subscribeToNewTrip({ userId: user.id });
    }
  }

  loadMore = (onPress) => {
    const { trips } = this.props;
    if (trips.loading) return null;

    const remaining = trips.count - trips.rows.length;
    if (remaining < 1) return null;

    return <LoadMore onPress={onPress} remainingCount={remaining} />;
  }

  isActiveRide = trip => (Moment(trip.date).isAfter());

  renderList = () => {
    const { trips } = this.props;

    return (
      <DataList
        data={trips}
        renderItem={({ item }) => (
          item.isDeleted || item.isBlocked ? null : <ActiveRideItem key={item.id} trip={item} />
        )}
        infinityScroll={false}
        loadMoreButton={this.loadMore}
        loadMorePosition="bottom"
        fetchMoreOptions={{
          variables: { offset: trips.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.trips.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.trips.rows.concat(
              fetchMoreResult.trips.rows,
            );

            return { trips: { ...previousResult.trips, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    const { trips } = this.props;

    if (trips.count < 1) return null;

    return (
      <View style={styles.section}>
        <AppText size={12} color={Colors.text.blue} style={styles.sectionTitle}>
          {trans('message.your_active_rides')}
        </AppText>
        {this.renderList()}
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
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewTrip: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyTrips, withNavigation, connect(mapStateToProps))(Ride);
