import React, { PureComponent } from 'react';
import GroupItem from '@components/feed/card/group';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { withNavigation } from 'react-navigation';

class SearchGroupResult extends PureComponent {
  redirect = (type, detail) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { group: detail });
  }

  render() {
    const { searchGroup, keyword } = this.props;

    return (
      <DataList
        data={searchGroup}
        renderItem={({ item }) => (
          <GroupItem
            min
            onPress={this.redirect}
            key={item.id}
            group={item}
          />
        )}
        fetchMoreOptions={{
          variables: { keyword, offset: searchGroup.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.searchGroup.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.searchGroup.rows.concat(fetchMoreResult.searchGroup.rows);

            return { searchGroup: { ...previousResult.searchGroup, ...{ rows } } };
          },
        }}
      />
    );
  }
}

SearchGroupResult.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  searchGroup: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
  }).isRequired,
  keyword: PropTypes.string.isRequired,
};

export default withNavigation(SearchGroupResult);
