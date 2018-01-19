import React, { Component } from 'react';
import TripItem from '@components/profile/tripsItem';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';

class UserTripsList extends Component {
  componentWillMount() {
    const { subscribeToNewTrip, id } = this.props;
    subscribeToNewTrip({ userId: id });
  }

  render() {
    const { trips, onPress, onSharePress } = this.props;
    return (<DataList
      data={trips}
      renderItem={({ item }) => (
        <TripItem
          key={item.id}
          trip={item}
          onPress={onPress}
          onSharePress={onSharePress}
        />
      )}
      fetchMoreOptions={{
        variables: { offset: trips.rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.trips.rows.length === 0) {
            return previousResult;
          }

          const rows = previousResult.trips.rows.concat(fetchMoreResult.trips.rows);

          return { trips: { ...previousResult.trips, ...{ rows } } };
        },
      }}
    />);
  }
}

UserTripsList.propTypes = {
  id: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  trips: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  subscribeToNewTrip: PropTypes.func.isRequired,
};

export default UserTripsList;
