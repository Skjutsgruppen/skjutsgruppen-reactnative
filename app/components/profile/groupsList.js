import React from 'react';
import { View, FlatList } from 'react-native';
import { Loading } from '@components/common';
import GroupsItem from '@components/profile/card/groups';
import PropTypes from 'prop-types';

const UsersGroupsList = ({ userId, onPress, data, data: { groups }, ...props }) => {
  if (data.networkStatus === 1) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View>
    );
  }

  return (
    <FlatList
      data={groups.rows}
      renderItem={({ item }) => <GroupsItem key={item.id} group={item} onPress={onPress} />}
      keyExtractor={(item, index) => index}
      {...props}
    />
  );
};

UsersGroupsList.propTypes = {
  userId: PropTypes.number.isRequired,
  data: PropTypes.shape({
    groups: PropTypes.shape({
      rows: PropTypes.array,
      count: PropTypes.number,
    }),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default UsersGroupsList;
