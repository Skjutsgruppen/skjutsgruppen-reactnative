import React from 'react';
import Item from '@components/feed/card/experience';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';

const UserExperienceList = ({ onPress, myExperiences }) => (
  <DataList
    data={myExperiences}
    renderItem={({ item }) => (
      <Item
        key={item.id}
        experience={item}
        onPress={onPress}
      />
    )}
    fetchMoreOptions={{
      variables: { offset: myExperiences.rows.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.myExperiences.rows.length === 0) {
          return previousResult;
        }

        const rows = previousResult.myExperiences.rows.concat(fetchMoreResult.myExperiences.rows);

        return { myExperiences: { ...previousResult.myExperiences, ...{ rows } } };
      },
    }}
  />
);

UserExperienceList.propTypes = {
  myExperiences: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default UserExperienceList;
