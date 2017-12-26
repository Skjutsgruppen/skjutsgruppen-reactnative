import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { Loading } from '@components/common';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';

const UsersGroupsList = ({ id, onPress, data, data: { friends }, ...props }) => {
  if (data.networkStatus === 1) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View>
    );
  }

  if (friends.rows.length) {
    return (
      <FlatList
        data={friends.rows}
        renderItem={({ item }) => <Friends key={item.id} friend={item} onPress={onPress} />}
        keyExtractor={(item, index) => index}
        {...props}
      />
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>No friends yet.</Text>
    </View>
  );
};

UsersGroupsList.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.shape({
    friends: PropTypes.shape({
      rows: PropTypes.array,
      count: PropTypes.number,
    }),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default UsersGroupsList;
