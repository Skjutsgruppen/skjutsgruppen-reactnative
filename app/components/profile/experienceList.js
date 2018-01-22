import React, { Component } from 'react';
import Item from '@components/feed/card/experience';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';


class UserExperienceList extends Component {
  componentWillMount() {
    const { subscribeToNewExperience, id } = this.props;
    subscribeToNewExperience({ userId: id });
  }

  render() {
    const { onPress, myExperiences } = this.props;

    return (
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
  }
}

UserExperienceList.propTypes = {
  myExperiences: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  subscribeToNewExperience: PropTypes.func.isRequired,
};

export default UserExperienceList;
