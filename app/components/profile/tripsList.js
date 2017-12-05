import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Loading } from '@components/common';
import TripItem from '@components/profile/tripsItem';
import PropTypes from 'prop-types';

const UserTripsList = ({ userId, onPress, onSharePress, data, ...props }) => {
  if (data.networkStatus === 1) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View>
    );
  }

  const { trips } = data;

  if (trips.rows.length !== 0) {
    return (
      <FlatList
        data={trips.rows}
        renderItem={({ item }) => (
          <TripItem
            key={item.id}
            trip={item}
            onPress={onPress}
            onSharePress={onSharePress}
          />
        )
        }
        keyExtractor={(item, index) => index}
        {...props}
      />
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>No rides yet.</Text>
    </View>
  );
};

UserTripsList.defaultProps = {
  data: {},
};

UserTripsList.propTypes = {
  userId: PropTypes.number.isRequired,
  data: PropTypes.shape({
    trips: PropTypes.shape({
      rows: PropTypes.array,
      count: PropTypes.number,
    }),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
};

export default UserTripsList;
