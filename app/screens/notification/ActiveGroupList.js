import React, { PureComponent } from 'react';
import { Wrapper } from '@components/common';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import DataList from '@components/dataList';
import { withMyGroups } from '@services/apollo/group';
import ActiveGroupItem from '@components/message/ActiveGroupItem';

class ActiveGroupList extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderActiveGroups = () => {
    const { groups } = this.props;

    return (
      <DataList
        data={groups}
        renderItem={({ item }) => (<ActiveGroupItem group={item} />)}
        fetchMoreOptions={{
          variables: { offset: groups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.groups.rows.concat(
              fetchMoreResult.groups.rows,
            );

            return { groups: { ...previousResult.groups, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <ToolBar title="Your groups" />
        {this.renderActiveGroups()}
      </Wrapper>
    );
  }
}

ActiveGroupList.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withMyGroups, withNavigation)(ActiveGroupList);
