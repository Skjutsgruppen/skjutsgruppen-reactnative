import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import List from '@components/group/enablers/addEnablerList';
import { withGroupMembers } from '@services/apollo/group';

const OnlyParticipant = withGroupMembers(List);

class AddEnabler extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    if (!navigation.state.params && !navigation.state.params.id) {
      return null;
    }

    const { id } = navigation.state.params;
    return (<OnlyParticipant id={id} excludeEnabler />);
  }
}

AddEnabler.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    }),
  }).isRequired,
};

export default AddEnabler;
