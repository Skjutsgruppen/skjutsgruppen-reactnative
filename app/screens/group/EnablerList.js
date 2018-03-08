import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import List from '@components/group/enablers/enablerList';
import { withGroupMembers } from '@services/apollo/group';

const Enablers = withGroupMembers(List);

class EnablerList extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    if (!navigation.state.params && navigation.state.params.group) {
      return null;
    }

    const { group } = navigation.state.params;
    return (<Enablers id={group.id} isAdmin={group.isAdmin} enabler />);
  }
}

EnablerList.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        group: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          isAdmin: PropTypes.bool.isRequired,
        }),
      }),
    }),
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default EnablerList;
