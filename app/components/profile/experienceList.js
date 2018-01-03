import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Loading } from '@components/common';
import Item from '@components/feed/card/experience';
import PropTypes from 'prop-types';

const UserExperienceList = ({ onPress, myExperiences }) => {
  if (myExperiences.networkStatus === 1) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View>
    );
  }

  if (myExperiences.rows.length > 0) {
    return (
      <FlatList
        data={myExperiences.rows}
        renderItem={({ item }) => (
          <Item
            key={item.id}
            experience={item}
            onPress={onPress}
          />
        )
        }
        keyExtractor={(item, index) => index}
      />
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>No experiences yet.</Text>
    </View>
  );
};

UserExperienceList.propTypes = {
  myExperiences: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default UserExperienceList;
