import React from 'react';
import { View, FlatList, Text } from 'react-native';
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

  if (groups.rows.length !== 0) {
    return (
      <FlatList
        data={groups.rows}
        renderItem={({ item }) => (
          <GroupsItem
            key={item.id}
            group={item}
            onPress={onPress}
            wrapperStyle={{ borderBottomWidth: 0, marginTop: 12, marginBottom: 0 }}
          />)
        }
        keyExtractor={(item, index) => index}
        {...props}
      />
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>No groups yet.</Text>
    </View>
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
