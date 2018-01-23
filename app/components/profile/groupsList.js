import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import GroupsItem from '@components/profile/card/groups';

class UsersGroupsList extends Component {
  componentWillMount() {
    const { subscribeToNewGroup, id } = this.props;
    subscribeToNewGroup({ userId: id });
  }

  render() {
    const { onPress, groups } = this.props;

    return (
      <DataList
        data={groups}
        renderItem={({ item }) => (
          <GroupsItem
            key={item.id}
            group={item}
            onPress={onPress}
            wrapperStyle={{ borderBottomWidth: 0, marginTop: 12, marginBottom: 0 }}
          />
        )}
        fetchMoreOptions={{
          variables: { offset: groups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.groups.rows.concat(fetchMoreResult.groups.rows);

            return { groups: { ...previousResult.groups, ...{ rows } } };
          },
        }}
      />
    );
  }
}

UsersGroupsList.propTypes = {
  groups: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
};

export default UsersGroupsList;
